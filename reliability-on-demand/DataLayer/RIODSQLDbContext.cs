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
    public class RIODSQLDbContext : DbContext
    {
        private string connectionString = null;

        private string validateAzureFunctionKey = null;

        public RIODSQLDbContext(IOptions<ValueSettings> valueSettings, DbContextOptions<RIODSQLDbContext> options) : base(options)
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

        public string GetAllTeamConfigs()
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetTeamConfigs";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here

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
                cmd.Parameters.Add(new SqlParameter("@ComputeResourceLocation", inquiry.ComputeResourceLocation));
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

            // prepare store procedure with necessary parameters
            cmd.CommandText = "dbo.AddStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyName", userCreatedStudy.StudyName));
            cmd.Parameters.Add(new SqlParameter("@LastRefreshDate", userCreatedStudy.LastRefreshDate));
            cmd.Parameters.Add(new SqlParameter("@CacheFrequency", userCreatedStudy.CacheFrequency));
            cmd.Parameters.Add(new SqlParameter("@Expiry", userCreatedStudy.Expiry));
            cmd.Parameters.Add(new SqlParameter("@TeamId", userCreatedStudy.TeamID));
            cmd.Parameters.Add(new SqlParameter("@ObservationWindowDays", userCreatedStudy.ObservationWindowDays));
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

        public string UpdateStudy(StudyConfig userUpdatedStudy)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();

            cmd.CommandText = "dbo.UpdateStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyName", userUpdatedStudy.StudyName));
            cmd.Parameters.Add(new SqlParameter("@LastRefreshDate", userUpdatedStudy.LastRefreshDate));
            cmd.Parameters.Add(new SqlParameter("@CacheFrequency", userUpdatedStudy.CacheFrequency));
            cmd.Parameters.Add(new SqlParameter("@Expiry", userUpdatedStudy.Expiry));
            cmd.Parameters.Add(new SqlParameter("@StudyID", userUpdatedStudy.StudyID));
            cmd.Parameters.Add(new SqlParameter("@ObservationWindowDays", userUpdatedStudy.ObservationWindowDays));

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
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetJSONConfiguredVerticalForAStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", studyID));
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

        //Get all pivots for that vertical
        public string GetPivots(string sourcesubtype)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetPivots";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@sourcesubtype", sourcesubtype));
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

        //Get all defaults for that vertical
        public string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllDefaultFailurePivotsForAVertical";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@sourcesubtype", sourcesubtype));
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

        //Get all configured values for that vertical and study id
        public string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int studyid)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllConfiguredFailurePivotsForAVertical";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@sourcesubtype", sourcesubtype));
            cmd.Parameters.Add(new SqlParameter("@studyID", studyid));
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }

        //Update all the watson call configured parameters for a study
        public void UpdateFailureSavedConfig(FailureConfig failure)
        {
            this.Database.OpenConnection();
            Int32 count = GetMaximumStudyPivotConfigCount(failure);

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "SELECT max(PivotScopeID) AS max FROM RELPivotScope";
            Int32 maxscopeid = (Int32)cmd.ExecuteScalar();
            if (count > 0)
            {
                DeletePivotScopeEnteries(failure);

                //Order matters- first extract the pivot scope ids from the relstudypivotconfig table and delete pivot scope ids first
                DeleteStudyIDFromPivotMapping(failure);

                DeleteStudyVerticals(failure);
            }

            this.AddFailureConfigToSQL(failure, maxscopeid);
        }

        int GetMaximumStudyPivotConfigCount(FailureConfig failure)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMaximumStudyPivotConfigCount";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", failure.StudyID));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
            Int32 count = (Int32)cmd.ExecuteScalar();
            return count;
        }

        void DeletePivotScopeEnteries(FailureConfig failure)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeletePivotScopeEnteries";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", failure.StudyID));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
            var pivotscopereader = cmd.ExecuteReader();
            pivotscopereader.Close();
        }

        void DeleteStudyIDFromPivotMapping(FailureConfig failure)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeleteStudyIDFromPivotMapping";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", failure.StudyID));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        void DeleteStudyVerticals(FailureConfig failure)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeleteStudyVerticals";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", failure.StudyID));
            var studyverticalreader = cmd.ExecuteReader();
            studyverticalreader.Close();
        }

        void AddFailureConfigToSQL(FailureConfig failure, int maxscopeid)
        {
            this.Database.OpenConnection();
            var scopeid = maxscopeid + 1;
            var cmd = this.Database.GetDbConnection().CreateCommand();

            for (var i = 0; i < failure.Pivots.Count; i++)
            {
                var pivot = failure.Pivots[i];
                if (pivot.IsScopeFilter == true && pivot.FilterExpression != null && pivot.FilterExpression != "")
                {
                    AddFilterPivotToFailureCurve(failure, scopeid, pivot);
                    pivot.PivotScopeID = scopeid;
                    scopeid++;
                }
            }

            for (var i = 0; i < failure.Pivots.Count; i++)
            {
                var pivot = failure.Pivots[i];
                cmd = this.Database.GetDbConnection().CreateCommand();

                if (pivot.PivotScopeID == 0 || pivot.IsScopeFilter == false)
                {
                    AddWithoutFilterPivotToFailureCurve(failure, pivot);
                }
                else
                {
                    AddFilterPivotsAndValuesToFailureCurve(failure, pivot);
                }

            }

            // inserting verticals for the study in failureverticalconfig table
            for (var i = 0; i < failure.Verticals.Count; i++)
            {
                AddVerticalsForStudy(failure, failure.Verticals[i]);
            }

            this.Database.CloseConnection();
        }

        void AddFilterPivotToFailureCurve(FailureConfig failure, int scopeid, Pivot pivot)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddFilterPivotToFailureCurve";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@PivotScopeID", scopeid));
            cmd.Parameters.Add(new SqlParameter("@PivotScopeValue", pivot.FilterExpression));
            cmd.Parameters.Add(new SqlParameter("@PivotScopeOperator", pivot.FilterExpressionOperator));
            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        void AddWithoutFilterPivotToFailureCurve(FailureConfig failure, Pivot pivot)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddWithoutFilterPivotToFailureCurve";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", failure.StudyID));
            cmd.Parameters.Add(new SqlParameter("@PivotID", pivot.PivotID));
            cmd.Parameters.Add(new SqlParameter("@IsSelectPivot", Convert.ToInt32(pivot.IsSelectPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionPivot", Convert.ToInt32(pivot.IsApportionPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsKeyPivot", Convert.ToInt32(pivot.IsKeyPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionJoinPivot", Convert.ToInt32(pivot.IsApportionJoinPivot)));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
        }

        void AddFilterPivotsAndValuesToFailureCurve(FailureConfig failure, Pivot pivot)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddFilterPivotsAndValuesToFailureCurve";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", failure.StudyID));
            cmd.Parameters.Add(new SqlParameter("@PivotID", pivot.PivotID));
            cmd.Parameters.Add(new SqlParameter("@IsSelectPivot", Convert.ToInt32(pivot.IsSelectPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionPivot", Convert.ToInt32(pivot.IsApportionPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsKeyPivot", Convert.ToInt32(pivot.IsKeyPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionJoinPivot", Convert.ToInt32(pivot.IsApportionJoinPivot)));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
            cmd.Parameters.Add(new SqlParameter("@PivotScopeID", pivot.PivotScopeID));
        }

        void AddVerticalsForStudy(FailureConfig failure, String vertical)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddVerticalsForStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyID", failure.StudyID));
            cmd.Parameters.Add(new SqlParameter("@Vertical", vertical));

            var insertionreader = cmd.ExecuteReader();
            insertionreader.Close();
        }

        //Get default metrics
        public string GetDefaultMetricsConfig(int StudyId)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetDefaultMetricConfigs";
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

        public string UpdateMetricConfig(MetricConfig userConfig)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.UpdateMetricConfig";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@UniqueKey", userConfig.UniqueKey));
            cmd.Parameters.Add(new SqlParameter("@MetricName", userConfig.MetricName));
            cmd.Parameters.Add(new SqlParameter("@Vertical", userConfig.Vertical));
            cmd.Parameters.Add(new SqlParameter("@MinUsageInMS", userConfig.MinUsageInMS));
            cmd.Parameters.Add(new SqlParameter("@FailureRateInHour", userConfig.FailureRateInHour));
            cmd.Parameters.Add(new SqlParameter("@HighUsageMinInMS", userConfig.HighUsageMinInMS));
            cmd.Parameters.Add(new SqlParameter("@MetricGoal", userConfig.MetricGoal));
            cmd.Parameters.Add(new SqlParameter("@StudyId", userConfig.StudyId));
            cmd.Parameters.Add(new SqlParameter("@MetricGoalAspirational", userConfig.MetricGoalAspirational));
            cmd.Parameters.Add(new SqlParameter("@IsUsage", userConfig.IsUsage));

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

        public string DeleteMetricConfig(MetricConfig userConfig)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeleteMetricConfig";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@UniqueKey", userConfig.UniqueKey));
            cmd.Parameters.Add(new SqlParameter("@MetricName", userConfig.MetricName));
            cmd.Parameters.Add(new SqlParameter("@Vertical", userConfig.Vertical));
            cmd.Parameters.Add(new SqlParameter("@MinUsageInMS", userConfig.MinUsageInMS));
            cmd.Parameters.Add(new SqlParameter("@FailureRateInHour", userConfig.FailureRateInHour));
            cmd.Parameters.Add(new SqlParameter("@HighUsageMinInMS", userConfig.HighUsageMinInMS));
            cmd.Parameters.Add(new SqlParameter("@MetricGoal", userConfig.MetricGoal));
            cmd.Parameters.Add(new SqlParameter("@StudyId", userConfig.StudyId));
            cmd.Parameters.Add(new SqlParameter("@MetricGoalAspirational", userConfig.MetricGoalAspirational));
            cmd.Parameters.Add(new SqlParameter("@IsUsage", userConfig.IsUsage));

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

        public string GetPopulationPivotSources()
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetPopulationPivotSources";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here

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

        public string GetPopulationPivots(string PivotSource)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetPopulationPivots";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@PivotSource", PivotSource));

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

        public string GetUserPivotConfigs(string PivotSource, int StudyId)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetUserPivotConfigs";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@PivotSource", PivotSource));
            cmd.Parameters.Add(new SqlParameter("@StudyID", StudyId));

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

