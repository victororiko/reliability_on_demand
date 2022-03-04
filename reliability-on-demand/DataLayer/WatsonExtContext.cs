using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using reliability_on_demand.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Reflection;
using System.Text;
using System.Xml.Serialization;

// please try to use capitalization style specified in .NET documentation - https://docs.microsoft.com/en-us/previous-versions/dotnet/netframework-1.1/x2dbyw72(v=vs.71)
namespace reliability_on_demand.DataLayer
{
    public class WatsonExtContext : DbContext
    {
        public DbSet<TeamConfig> TeamConfigs { get; set;}
        private string connectionString = null;

        private string validateAzureFunctionKey = null;

        public WatsonExtContext(IOptions<ValueSettings> valueSettings, DbContextOptions options) : base(options)
        {
            connectionString = valueSettings.Value.relreportingdbsqlconn;
            validateAzureFunctionKey = valueSettings.Value.FailureValidateAzureFunction;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(connectionString);
        }

        public int LogRelOnDemandQuery<T>(string username, string url, string access = "post", T payload = default(T))
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.LogRelOnDemandQuery";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@username", username));
            cmd.Parameters.Add(new SqlParameter("@url", url));
            cmd.Parameters.Add(new SqlParameter("@access", access));

            if (payload != null)
            {
                XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(payload.GetType());
                // remove xmlns default namespace
                var ns = new XmlSerializerNamespaces();
                ns.Add("", "");

                using (StringWriter textWriter = new StringWriter())
                {
                    serializer.Serialize(textWriter, payload, ns);
                    cmd.Parameters.Add(new SqlParameter("@payload", textWriter.ToString()));
                }
            }

            var id = cmd.ExecuteScalar();
            return id != null ? int.Parse(id.ToString()) : -1;
        }

        public void UpdateRelOnDemandQuery(int queryID, bool status = true, string exception = null)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.UpdateRelOnDemandQuery";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@queryID", queryID));
            cmd.Parameters.Add(new SqlParameter("@status", status));
            cmd.Parameters.Add(new SqlParameter("@exception", exception));

            cmd.ExecuteNonQuery();
        }

        public string GetAllUnifiedConfigs()
        {
            return GetSQLResultsJSON("SELECT * FROM [dbo].[RELUnifiedConfig]");
        }

        public List<TeamConfig> GetAllTeamConfigs()
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "SELECT * FROM [dbo].[RELTeamConfig]";

            using (var reader = cmd.ExecuteReader())
            {
                return DataReaderMapToList<TeamConfig>(reader);
            }
        }

        public string SaveTeam(TeamConfig inquiry)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();

            if (inquiry.TeamID == -1)
            {
                cmd.CommandText = "dbo.AddTeam";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                // add any params here
                cmd.Parameters.Add(new SqlParameter("@OwnerContact", inquiry.OwnerContact));
                cmd.Parameters.Add(new SqlParameter("@OwnerTeamFriendlyName", inquiry.OwnerTeamFriendlyName));
                cmd.Parameters.Add(new SqlParameter("@OwnerTriageAlias", inquiry.OwnerTriageAlias));
                cmd.Parameters.Add(new SqlParameter("@ComputeResourceLocation",inquiry.ComputeResourceLocation));
            }
            else
            {
                cmd.CommandText = "dbo.UpdateTeam";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@OwnerContact", inquiry.OwnerContact));
                cmd.Parameters.Add(new SqlParameter("@OwnerTeamFriendlyName", inquiry.OwnerTeamFriendlyName));
                cmd.Parameters.Add(new SqlParameter("@OwnerTriageAlias", inquiry.OwnerTriageAlias));
                cmd.Parameters.Add(new SqlParameter("@ComputeResourceLocation", inquiry.ComputeResourceLocation));
                cmd.Parameters.Add(new SqlParameter("@TeamID", inquiry.TeamID));
            }

            // execute stored procedure and return json
            StringBuilder sb = new StringBuilder();
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

        public string DeleteTeam(TeamConfig inquiry)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();

            cmd.CommandText = "dbo.DeleteTeam";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@TeamID", inquiry.TeamID));
            StringBuilder sb = new StringBuilder();
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

          public string GetAllStudyConfigsForTeam(int TeamID)
          {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllStudyConfigsForTeam";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@TeamID", TeamID));

            // execute stored procedure and return json
            StringBuilder sb = new StringBuilder();
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

        public string AddStudy(StudyConfig userCreatedStudy)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();

            if (userCreatedStudy.StudyID.Equals("-1"))
            {
                // prepare store procedure with necessary parameters
                cmd.CommandText = "dbo.AddStudy";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                // add any params here
                cmd.Parameters.Add(new SqlParameter("@StudyName", userCreatedStudy.StudyName));
                cmd.Parameters.Add(new SqlParameter("@LastModifiedDate", userCreatedStudy.LastModifiedDate));
                cmd.Parameters.Add(new SqlParameter("@CacheFrequency", userCreatedStudy.CacheFrequency));
                cmd.Parameters.Add(new SqlParameter("@Expiry", userCreatedStudy.Expiry));
                cmd.Parameters.Add(new SqlParameter("@TeamId", userCreatedStudy.TeamId));
                cmd.Parameters.Add(new SqlParameter("@ObservationWindowDays", userCreatedStudy.ObservationWindowDays));
            }
            else
            {
                cmd.CommandText = string.Format("UPDATE RELStudyConfig SET StudyName = '{0}', LastRefreshDate = '{1}',CacheFrequency = {2},Expiry = '{3}',ObservationWindowDays={4} WHERE StudyID ={5} ", userCreatedStudy.StudyName,userCreatedStudy.LastModifiedDate,userCreatedStudy.CacheFrequency,userCreatedStudy.Expiry,userCreatedStudy.ObservationWindowDays,userCreatedStudy.StudyID);
            }
            // execute stored procedure and return json
            StringBuilder sb = new StringBuilder();
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

        public string GetSQLResults(string SQLquery)
        {
            // ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = SQLquery;

            using (var reader = cmd.ExecuteReader())
            {
                List<RelUnifiedConfig> configList = new List<RelUnifiedConfig>();
                configList = DataReaderMapToList<RelUnifiedConfig>(reader);

                string json = JsonConvert.SerializeObject(configList);
                return json;
            }

        }

        //Tutorial - https://visualstudiomagazine.com/articles/2017/08/01/returning-json.aspx
        public string GetSQLResultsJSON(string SQLquery)
        {
            // make sure to get results in JSON
            SQLquery += " FOR JSON AUTO, Include_Null_Values";
            StringBuilder sb = new StringBuilder();

            // ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = SQLquery;

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();

        }

        public List<T> DataReaderMapToList<T>(IDataReader dr)
        {
            List<T> list = new List<T>();
            T obj = default(T);
            while (dr.Read())
            {
                obj = Activator.CreateInstance<T>();
                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (!object.Equals(dr[prop.Name], DBNull.Value))
                    {
                        prop.SetValue(obj, dr[prop.Name], null);
                    }
                }
                list.Add(obj);
            }
            return list;
        }

        //Get all verticals from the Failure vertical SQL table
        public string GetVerticals()
        {
            return GetSQLResultsJSON("SELECT VerticalName,PivotSourceSubType FROM [dbo].[RELFailureVertical]");
        }

        public string GetConfiguredVerticalForAStudy(int studyID)
        {
            String query = String.Format("SELECT f.VerticalName, PivotSourceSubType FROM RELFailureVertical AS f INNER JOIN RELFailureVerticalConfig AS c ON f.VerticalName = c.VerticalName WHERE c.StudyID = {0}",studyID);
            return GetSQLResultsJSON(query);
        }

        //Get all pivots for that vertical
        public string GetPivots(string sourcesubtype)
        {
            string query = string.Format("SELECT PivotID,PivotSourceColumnName,UIInputDataType FROM [dbo].[RELPivotInfo] AS info INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource WHERE info.PivotSourceSubType LIKE '{0}' AND map.PivotSourceType LIKE 'Failure%'", sourcesubtype);
            return GetSQLResultsJSON(query);
        }

        //Get all defaults for that vertical
        public string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype)
        {
            string query = string.Format("SELECT info.PivotID,info.PivotSourceColumnName,info.UIInputDataType,smap.IsSelectColumn,smap.IsKeyColumn,smap.IsApportionColumn,smap.IsApportionJoinColumn,smap.PivotScopeID,scope.PivotScopeValue,scope.PivotScopeOperator FROM RELStudyPivotConfigDefault AS smap INNER JOIN RELPivotInfo AS info ON smap.PivotKey = info.PivotKey INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID WHERE smap.PivotSourceSubType LIKE '{0}' AND map.PivotSourceType LIKE 'Failure%'", sourcesubtype);
            string res = GetSQLResultsJSON(query);
            return res;
        }

        //Get all configured values for that vertical and study id
        public string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int studyid)
        {
            string query = string.Format("SELECT info.PivotID,info.PivotSourceColumnName,info.UIInputDataType,smap.IsApportionColumn,smap.IsApportionJoinColumn,smap.IsKeyColumn,smap.IsSelectColumn,smap.PivotScopeID,scope.PivotScopeValue,scope.PivotScopeOperator FROM RELPivotInfo AS info INNER JOIN RELStudyPivotConfig AS smap ON info.PivotID = smap.PivotID INNER JOIN RELPivotSourceMap AS map ON map.PivotSource = info.PivotSource LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID WHERE smap.StudyID = {0} AND map.PivotSourceType LIKE 'Failure%' AND smap.PivotSourceSubType LIKE '{1}'", studyid, sourcesubtype);
            string res = GetSQLResultsJSON(query);
            return res;
        }

        //Update all the watson call configured parameters for a study
        public void UpdateFailureSavedConfig(FailureConfig f)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMaximumStudyPivotConfigCount";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", f.StudyID));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", f.PivotSourceSubType));
            Int32 count = (Int32)cmd.ExecuteScalar();

            cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "SELECT max(PivotScopeID) AS max FROM RELPivotScope";
            Int32 maxscopeid = (Int32)cmd.ExecuteScalar();
            if (count > 0)
                {
                    cmd.CommandText = "dbo.DeletePivotScopeEnteries";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    // add any params here
                    cmd.Parameters.Add(new SqlParameter("@StudyID", f.StudyID));
                    cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", f.PivotSourceSubType));
                    var pivotscopereader = cmd.ExecuteReader();
                    pivotscopereader.Close();

                    //Order matters- first extract the pivot scope ids from the relstudypivotconfig table and delete pivot scope ids first
                    cmd = this.Database.GetDbConnection().CreateCommand();
                    cmd.CommandText = "dbo.DeleteStudyIDFromPivotMapping";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    // add any params here
                    cmd.Parameters.Add(new SqlParameter("@StudyID", f.StudyID));
                    cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", f.PivotSourceSubType));
                    var reader = cmd.ExecuteReader();
                    reader.Close();

                    cmd = this.Database.GetDbConnection().CreateCommand();
                    cmd.CommandText = "dbo.DeleteStudyVerticals";
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    // add any params here
                    cmd.Parameters.Add(new SqlParameter("@StudyID", f.StudyID));
                    var studyverticalreader = cmd.ExecuteReader();
                    studyverticalreader.Close();
                }

                this.AddFailureConfigToSQL(f, maxscopeid);
        }


        void AddFailureConfigToSQL(FailureConfig f,int maxscopeid)
        {
            this.Database.OpenConnection();
            var scopeid = maxscopeid + 1;
            var cmd = this.Database.GetDbConnection().CreateCommand();
            string query = "";

            for (var i = 0; i < f.Pivots.Count; i++)
            {
                var p = f.Pivots[i];
                if (p.IsScopeFilter == true && p.FilterExpression!=null && p.FilterExpression!="")
                {
                    
                    query += string.Format("INSERT INTO RELPivotScope(PivotScopeID,PivotScopeValue,PivotScopeOperator) VALUES({0},'{1}','{2}')", scopeid, p.FilterExpression, p.FilterExpressionOperator);
                    p.PivotScopeID = scopeid;
                    scopeid++;
                }
            }

            if (query != null && query != "")
            {
                cmd.CommandText = query;
                var reader = cmd.ExecuteReader();
                reader.Close();
            }
            

            var cmdInsert = this.Database.GetDbConnection().CreateCommand();
            string insertionquery = "";

            for (var i = 0; i < f.Pivots.Count; i++)
            {
                var p = f.Pivots[i];
                if (p.PivotScopeID == 0 || p.IsScopeFilter == false)
                {
                    insertionquery += string.Format("INSERT INTO RELStudyPivotConfig(StudyID,PivotID,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType) VALUES({0},{1},{2},{3},{4},{5},'{6}')", f.StudyID, p.PivotID, Convert.ToInt32(p.IsSelectPivot), Convert.ToInt32(p.IsApportionPivot), Convert.ToInt32(p.IsKeyPivot), Convert.ToInt32(p.IsApportionJoinPivot), f.PivotSourceSubType);
                }
                else
                {
                    insertionquery += string.Format("INSERT INTO RELStudyPivotConfig(PivotScopeID,StudyID,PivotID,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType) VALUES({0},{1},{2},{3},{4},{5},{6},'{7}')",p.PivotScopeID, f.StudyID, p.PivotID, Convert.ToInt32(p.IsSelectPivot), Convert.ToInt32(p.IsApportionPivot), Convert.ToInt32(p.IsKeyPivot), Convert.ToInt32(p.IsApportionJoinPivot), f.PivotSourceSubType);
                }
            }


            if (insertionquery != null && insertionquery != "")
            {
                cmdInsert.CommandText = insertionquery;

                var insertionreader = cmdInsert.ExecuteReader();

                insertionreader.Close();
            }


            // inserting verticals for the study in failureverticalconfig table
            for (var i = 0; i < f.Verticals.Count; i++)
            {
                cmd = this.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = "dbo.AddVerticalsForStudy";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                // add any params here
                cmd.Parameters.Add(new SqlParameter("@StudyID", f.StudyID));
                cmd.Parameters.Add(new SqlParameter("@Vertical", f.Verticals[i]));

                var insertionreader = cmd.ExecuteReader();
                insertionreader.Close();
            }

            this.Database.CloseConnection();
        }

        //Get default metrics
        public string GetDefaultMetricsConfig()
        {
            string query = "SELECT * FROM [dbo].[RelMetricConfiguration_Defaults]";
            string res = GetSQLResultsJSON(query);
            return res;
        }        
        public string AddMetricConfig(MetricConfig userCreatedMetric)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddMetricConfig";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@MetricName", userCreatedMetric.MetricName));
            cmd.Parameters.Add(new SqlParameter("@Vertical", userCreatedMetric.Vertical));
            cmd.Parameters.Add(new SqlParameter("@MinUsageInMS", userCreatedMetric.MinUsageInMS));
            cmd.Parameters.Add(new SqlParameter("@FailureRateInHour", userCreatedMetric.FailureRateInHour));
            cmd.Parameters.Add(new SqlParameter("@HighUsageMinInMS", userCreatedMetric.HighUsageMinInMS));
            cmd.Parameters.Add(new SqlParameter("@MetricGoal", userCreatedMetric.MetricGoal));
            cmd.Parameters.Add(new SqlParameter("@StudyId", userCreatedMetric.StudyId));
            cmd.Parameters.Add(new SqlParameter("@MetricGoalAspirational", userCreatedMetric.MetricGoalAspirational));
            cmd.Parameters.Add(new SqlParameter("@IsUsage", userCreatedMetric.IsUsage));

            // execute stored procedure and return json
            StringBuilder sb = new StringBuilder();
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }
        public string GetMetricConfigs(int StudyId)
          {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMetricConfigs";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyId", StudyId));

            // execute stored procedure and return json
            StringBuilder sb = new StringBuilder();
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }
    }
}
