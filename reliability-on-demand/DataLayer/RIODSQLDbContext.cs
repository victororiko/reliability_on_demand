using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userUpdatedStudy.StudyConfigID));
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

        // Get all pivotscope data for given pivot keys
        public string GetAllScopeForPivotKeys(string pivotkeys)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetJSONAllScopeForPivotKeys";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@PivotKeys", pivotkeys));
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    sb.Append(reader.GetString(0));
                }
            }
            return sb.ToString();
        }


        // Get all filter expression data for given pivot socpe ids
        public string GetFilterExpressionForPivotScopeIds(StudyConfigIDWithScopesInquiry inquiry)
        {
            StringBuilder sb = new StringBuilder();

            for (int pivotscopeidPtr = 0; pivotscopeidPtr < inquiry.PivotScopeIDs.Length; pivotscopeidPtr++)
            {
                //ensure that connection is open
                this.Database.OpenConnection();
                var cmd = this.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = "dbo.GetFilterExpressionForPivotScopeIds";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                // add any params here
                cmd.Parameters.Add(new SqlParameter("@PivotScopeId", inquiry.PivotScopeIDs[pivotscopeidPtr]));
                cmd.Parameters.Add(new SqlParameter("@StudyConfigID", inquiry.StudyConfigID));
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        if (reader.GetString(0) != null && reader.GetString(0).Length > 0)
                        {
                            sb.Append(reader.GetString(0)).Replace("[", "").Replace("]", ",");
                        }
                    }
                }
            }

            string res = null;
            if (sb != null && sb.Length > 0)
            {
                res = "";
                sb.Insert(0, "[").Append("]");
                var lastcomma = sb.ToString().LastIndexOf(',');
                res = sb.ToString().Substring(0, lastcomma) + sb.ToString().Substring(lastcomma + 1);
            }
            return res;
        }

        //Get all verticals from the Failure vertical SQL table
        public string GetAllVerticals()
        {
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();

            cmd.CommandText = "dbo.GetAllVerticals";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
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

        public string GetConfiguredVerticalForAStudy(int StudyConfigID)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetJSONConfiguredVerticalForAStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));
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
        public string GetFailurePivots(string sourcesubtype)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetFailurePivots";
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
        public string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int StudyConfigID)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllConfiguredFailurePivotsForAVertical";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@sourcesubtype", sourcesubtype));
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));
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
            cmd.CommandText = "dbo.GetMaximumPivotScopeID";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            var maxScopeObj = cmd.ExecuteScalar();
            Int32 maxscopeid = (Convert.IsDBNull(maxScopeObj) ? 0 : (Int32)maxScopeObj);
            DeleteStudyVerticals(failure);

            if (count > 0)
            {
                DeleteStudyConfigIDFromPivotMapping(failure);
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
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", failure.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
            var maxScopeObj = cmd.ExecuteScalar();
            Int32 count = (Convert.IsDBNull(maxScopeObj) ? 0 : (Int32)maxScopeObj);
            return count;
        }

        void DeleteStudyConfigIDFromPivotMapping(FailureConfig failure)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeleteStudyConfigIDFromPivotMapping";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", failure.StudyConfigID));
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
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", failure.StudyConfigID));
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
                for (int j = 0; j < pivot.FilterExpressions.Length; j++)
                {
                    int pivotscopeid = AddFilterPivotToFailureCurve(failure, scopeid, pivot, pivot.FilterExpressions[j]);
                    pivot.FilterExpressions[j].PivotScopeID = pivotscopeid;
                    if (pivotscopeid == scopeid)
                        scopeid++;
                }
            }

            for (var i = 0; i < failure.Pivots.Count; i++)
            {
                var pivot = failure.Pivots[i];
                cmd = this.Database.GetDbConnection().CreateCommand();
                for (int j = 0; j < pivot.FilterExpressions.Length; j++)
                {
                    AddFilterPivotsAndValuesToFailureCurve(failure, pivot, pivot.FilterExpressions[j]);
                }

                if ((pivot.FilterExpressions == null || pivot.FilterExpressions.Length == 0) || pivot.IsScopeFilter == false)
                {
                    AddWithoutFilterPivotToFailureCurve(failure, pivot);
                }

            }

            // inserting verticals for the study in failureverticalconfig table
            for (var i = 0; i < failure.Verticals.Count; i++)
            {
                AddVerticalsForStudy(failure, failure.Verticals[i]);
            }

            this.Database.CloseConnection();
        }

        int AddFilterPivotToFailureCurve(FailureConfig failure, int scopeid, Pivot pivot, FilterExpression filterexp)
        {
            Int32 pivotscopeid = GetPivotScopeIDForFilterExp(filterexp);
            if (pivotscopeid != 0)
            {
                return pivotscopeid;
            }
            else
            {
                var cmd = this.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = "dbo.AddFilterPivotToFailureCurve";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                // add any params here
                cmd.Parameters.Add(new SqlParameter("@PivotScopeID", scopeid));
                cmd.Parameters.Add(new SqlParameter("@PivotScopeValue", filterexp.PivotValue));
                cmd.Parameters.Add(new SqlParameter("@PivotOperator", filterexp.Operator));
                cmd.Parameters.Add(new SqlParameter("@PivotKey", pivot.PivotKey));
                var reader = cmd.ExecuteReader();
                reader.Close();
                return scopeid;
            }
        }

        int GetPivotScopeIDForFilterExp(FilterExpression filterexp)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetPivotScopeIDForFilterExp";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@PivotValue", filterexp.PivotValue));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", filterexp.PivotKey));
            cmd.Parameters.Add(new SqlParameter("@PivotOperator", filterexp.Operator));
            var PivotScopeID = cmd.ExecuteScalar();
            Int32 scopeid = (PivotScopeID == null ? 0 : (Int32)PivotScopeID);
            return scopeid;
        }

        void AddWithoutFilterPivotToFailureCurve(FailureConfig failure, Pivot pivot)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddWithoutFilterPivotToFailureCurve";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", failure.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@IsSelectPivot", Convert.ToInt32(pivot.IsSelectPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionPivot", Convert.ToInt32(pivot.IsApportionPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsKeyPivot", Convert.ToInt32(pivot.IsKeyPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionJoinPivot", Convert.ToInt32(pivot.IsApportionJoinPivot)));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", pivot.PivotKey));

            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        void AddFilterPivotsAndValuesToFailureCurve(FailureConfig failure, Pivot pivot, FilterExpression filterexp)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddFilterPivotsAndValuesToFailureCurve";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", failure.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@IsSelectPivot", Convert.ToInt32(pivot.IsSelectPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionPivot", Convert.ToInt32(pivot.IsApportionPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsKeyPivot", Convert.ToInt32(pivot.IsKeyPivot)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionJoinPivot", Convert.ToInt32(pivot.IsApportionJoinPivot)));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", failure.PivotSourceSubType));
            cmd.Parameters.Add(new SqlParameter("@PivotScopeID", filterexp.PivotScopeID));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", pivot.PivotKey));
            cmd.Parameters.Add(new SqlParameter("@PivotSopeOperator", filterexp.RelationalOperator));

            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        void AddVerticalsForStudy(FailureConfig failure, String vertical)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddVerticalsForStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", failure.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@Vertical", vertical));

            var insertionreader = cmd.ExecuteReader();
            insertionreader.Close();
        }

        //Get default metrics
        public string GetDefaultMetricsConfig(int StudyConfigID)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetDefaultMetricConfigs";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));

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
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userCreatedMetric.StudyConfigID));
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
        public string GetMetricConfigs(int StudyConfigID)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMetricConfigs";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));

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
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userConfig.StudyConfigID));
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
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userConfig.StudyConfigID));
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

        public string GetUserPivotConfigs(string PivotSource, int StudyConfigID)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetUserPivotConfigs";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@PivotSource", PivotSource));
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));

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

        private bool EmptyScope(PopulationPivotConfig userConfig)
        {
            return userConfig.PivotScopeValue == "";
        }

        private int GetMaxScopeID()
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMaximumPivotScopeID";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            var maxScopeObj = cmd.ExecuteScalar();
            Int32 maxscopeid = (Convert.IsDBNull(maxScopeObj) ? 0 : (Int32)maxScopeObj);
            return maxscopeid;
        }

        public string AddOrUpdatePivotConfig(PopulationPivotConfig userConfig)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            int nextScopeID = userConfig.PivotScopeID;
            if (!EmptyScope(userConfig))
            {
                // get max scopeid
                nextScopeID = GetMaxScopeID() + 1;
                // add scope to RELPivotScope table
                var cmd2 = this.Database.GetDbConnection().CreateCommand();
                cmd2.CommandText = "dbo.AddFilterPivotToFailureCurve";
                cmd2.CommandType = System.Data.CommandType.StoredProcedure;
                cmd2.Parameters.Add(new SqlParameter("@PivotScopeID", nextScopeID));
                cmd2.Parameters.Add(new SqlParameter("@PivotScopeValue", userConfig.PivotScopeValue));
                cmd2.Parameters.Add(new SqlParameter("@PivotOperator", userConfig.RelationalOperator));
                cmd2.Parameters.Add(new SqlParameter("@PivotKey", userConfig.PivotKey));
                var reader = cmd2.ExecuteReader();
                reader.Close();

            }

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddOrUpdatePivotConfig";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userConfig.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", userConfig.PivotKey));
            cmd.Parameters.Add(new SqlParameter("@AggregateBy", userConfig.AggregateBy));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", userConfig.PivotSourceSubType));
            cmd.Parameters.Add(new SqlParameter("@PivotScopeOperator", userConfig.RelationalOperator));
            cmd.Parameters.Add(new SqlParameter("@PivotScopeID", nextScopeID));

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

        public string ClearPivotConfig(PopulationPivotConfig userConfig)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.ClearPivotConfig";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userConfig.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", userConfig.PivotKey));

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

