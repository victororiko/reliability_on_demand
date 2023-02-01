using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using reliability_on_demand.Extensions;
using reliability_on_demand.Models;
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
            cmd.Parameters.Add(new SqlParameter("@StudyType", userCreatedStudy.StudyType));
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

            // prepare store procedure with necessary parameters
            cmd.CommandText = "dbo.UpdateStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyName", userUpdatedStudy.StudyName));
            cmd.Parameters.Add(new SqlParameter("@LastRefreshDate", userUpdatedStudy.LastRefreshDate));
            cmd.Parameters.Add(new SqlParameter("@CacheFrequency", userUpdatedStudy.CacheFrequency));
            cmd.Parameters.Add(new SqlParameter("@Expiry", userUpdatedStudy.Expiry));
            cmd.Parameters.Add(new SqlParameter("@TeamId", userUpdatedStudy.TeamID));
            cmd.Parameters.Add(new SqlParameter("@ObservationWindowDays", userUpdatedStudy.ObservationWindowDays));
            cmd.Parameters.Add(new SqlParameter("@StudyType", userUpdatedStudy.StudyType));
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userUpdatedStudy.StudyConfigID));
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

        public string DeleteStudy(StudyConfig userUpdatedStudy)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();

            cmd.CommandText = "dbo.DeleteStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@TeamID", userUpdatedStudy.TeamID));
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", userUpdatedStudy.StudyConfigID));

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

        public string GetDefaultVerticalForAStudy(int StudyConfigID)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetDefaultVerticalForAStudy";
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

        public void SavePivotConfig(Pivot[] pivots)
        {
            if (pivots == null || pivots.Length == 0) return;

            this.Database.OpenConnection();
            string source = pivots[0].PivotKey.Split('_')[0];

            // Checking if the StudyPivotConfig already contains the default values or not
            Int32 count = GetMaximumStudyPivotConfigCount(pivots[0].StudyConfigID, source);

            // Getting the maximum pivot scope id in RELPivotSCope table
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMaximumPivotScopeID";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            var maxScopeObj = cmd.ExecuteScalar();
            Int32 maxscopeid = (Convert.IsDBNull(maxScopeObj) ? 0 : (Int32)maxScopeObj);

            // Delete the old values in the db
            if (count > 0)
            {
                DeleteStudyConfigIDFromPivotMapping(pivots[0].StudyConfigID, source);
            }

            // Add new enteries to the db
            this.AddPivotsToSQL(pivots, maxscopeid);
        }

        // Add new enteries to the db
        void AddPivotsToSQL(Pivot[] pivots, int maxscopeid)
        {
            this.Database.OpenConnection();
            var scopeid = maxscopeid + 1;
            HashSet<string> pivotkeys = new HashSet<string>();

            for (var i = 0; i < pivots.Length; i++)
            {
                var pivot = pivots[i];
                if (pivot.PivotOperator != null && pivot.PivotScopeValue != null && !pivot.PivotOperator.Equals("") && !pivot.PivotScopeValue.Equals(""))
                {
                    int pivotscopeid = AddFilterPivotToFailureCurve(pivot.PivotKey, pivot.PivotOperator, pivot.PivotScopeValue, scopeid);
                    pivot.PivotScopeID = pivotscopeid;
                    if (pivotscopeid == scopeid)
                        scopeid++;
                }
            }

            for (var i = 0; i < pivots.Length; i++)
            {
                var pivot = pivots[i];
                if (pivot.PivotOperator != null && pivot.PivotScopeValue != null && !pivot.PivotOperator.Equals("") && !pivot.PivotScopeValue.Equals(""))
                {
                    AddFilterPivotsAndValuesToFailureCurve(pivot);
                }
                else
                {
                    if(pivotkeys.Add(pivot.PivotKey))
                        AddWithoutFilterPivotToFailureCurve(pivot);
                }

            }
            this.Database.CloseConnection();
        }

        //Update all the watson call configured parameters for a study
        public void UpdateFailureSavedConfig(Pivot[] pivots)
        {
            this.Database.OpenConnection();
            Int32 count = GetMaximumStudyPivotConfigCount(pivots[0].StudyConfigID, pivots[0].PivotSourceSubType);
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMaximumPivotScopeID";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            var maxScopeObj = cmd.ExecuteScalar();
            Int32 maxscopeid = (Convert.IsDBNull(maxScopeObj) ? 0 : (Int32)maxScopeObj);
            DeleteStudyVerticals(pivots[0].StudyConfigID);
            string source = pivots[0].PivotKey.Split('_')[0];

            if (count > 0)
            {
                DeleteStudyConfigIDFromPivotMapping(pivots[0].StudyConfigID, source);
            }

            this.AddFailureConfigToSQL(pivots, maxscopeid);
        }

        int GetMaximumStudyPivotConfigCount(int StudyConfigID, string PivotSource)
        {
            PivotSource = '%' + PivotSource + '%';
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetMaximumStudyPivotConfigCount";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@PivotSource", PivotSource));
            var maxScopeObj = cmd.ExecuteScalar();
            Int32 count = (Convert.IsDBNull(maxScopeObj) ? 0 : (Int32)maxScopeObj);
            return count;
        }

        void DeleteStudyConfigIDFromPivotMapping(int StudyConfigID, string PivotSource)
        {
            PivotSource = '%' + PivotSource + '%';
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeleteStudyConfigIDFromPivotMapping";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@PivotSource", PivotSource));
            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        void DeleteStudyVerticals(int StudyConfigID)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeleteStudyVerticals";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));
            var studyverticalreader = cmd.ExecuteReader();
            studyverticalreader.Close();
        }

        void AddFailureConfigToSQL(Pivot[] pivots, int maxscopeid)
        {
            this.Database.OpenConnection();
            var scopeid = maxscopeid + 1;
            var cmd = this.Database.GetDbConnection().CreateCommand();
            HashSet<string> pivotkeys = new HashSet<string>();

            for (var i = 0; i < pivots.Length; i++)
            {
                var pivot = pivots[i];
                if (pivot.IsScopeFilter == true && pivot.PivotOperator != null && pivot.PivotScopeValue != null && !pivot.PivotOperator.Equals("") && !pivot.PivotScopeValue.Equals(""))
                {
                    int pivotscopeid = AddFilterPivotToFailureCurve(pivot.PivotKey, pivot.PivotOperator, pivot.PivotScopeValue, scopeid);
                    pivot.PivotScopeID = pivotscopeid;
                    if (pivotscopeid == scopeid)
                        scopeid++;
                }
            }

            for (var i = 0; i < pivots.Length; i++)
            {
                var pivot = pivots[i];
                cmd = this.Database.GetDbConnection().CreateCommand();
                if (pivot.IsScopeFilter == true && pivot.PivotOperator != null && pivot.PivotScopeValue != null && !pivot.PivotOperator.Equals("") && !pivot.PivotScopeValue.Equals(""))
                {
                    AddFilterPivotsAndValuesToFailureCurve(pivot);
                }
                else
                {
                    if(pivotkeys.Add(pivot.PivotKey))
                        AddWithoutFilterPivotToFailureCurve(pivot);
                }

            }

            // inserting verticals for the study in failureverticalconfig table
            for (var i = 0; i < pivots[0].Verticals.Length; i++)
            {
                AddVerticalsForStudy(pivots[0].StudyConfigID, pivots[0].Verticals[i]);
            }

            this.Database.CloseConnection();
        }

        int AddFilterPivotToFailureCurve(string pivotkey, string pivotop, string pivotvalue, int scopeid)
        {
            Int32 pivotscopeid = GetPivotScopeIDForFilterExp(pivotkey, pivotop, pivotvalue);
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
                cmd.Parameters.Add(new SqlParameter("@PivotScopeValue", pivotvalue));
                cmd.Parameters.Add(new SqlParameter("@PivotOperator", pivotop));
                cmd.Parameters.Add(new SqlParameter("@PivotKey", pivotkey));
                var reader = cmd.ExecuteReader();
                reader.Close();
                return scopeid;
            }
        }

        int GetPivotScopeIDForFilterExp(string pivotkey, string pivotop, string pivotvalue)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetPivotScopeIDForFilterExp";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@PivotValue", pivotvalue));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", pivotkey));
            cmd.Parameters.Add(new SqlParameter("@PivotOperator", pivotop));
            var PivotScopeID = cmd.ExecuteScalar();
            Int32 scopeid = (PivotScopeID == null ? 0 : (Int32)PivotScopeID);
            return scopeid;
        }

        void AddWithoutFilterPivotToFailureCurve(Pivot pivot)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddWithoutFilterPivotToFailureCurve";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", pivot.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@IsSelectPivot", Convert.ToInt32(pivot.IsSelectColumn)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionPivot", Convert.ToInt32(pivot.IsApportionColumn)));
            cmd.Parameters.Add(new SqlParameter("@IsKeyPivot", Convert.ToInt32(pivot.IsKeyColumn)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionJoinPivot", Convert.ToInt32(pivot.IsApportionJoinColumn)));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", pivot.PivotSourceSubType));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", pivot.PivotKey));
            cmd.Parameters.Add(new SqlParameter("@AggregateBy", pivot.AggregateBy));
            cmd.Parameters.Add(new SqlParameter("@PivotExpression", pivot.PivotExpression));

            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        void AddFilterPivotsAndValuesToFailureCurve(Pivot pivot)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddFilterPivotsAndValuesToFailureCurve";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", pivot.StudyConfigID));
            cmd.Parameters.Add(new SqlParameter("@IsSelectPivot", Convert.ToInt32(pivot.IsSelectColumn)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionPivot", Convert.ToInt32(pivot.IsApportionColumn)));
            cmd.Parameters.Add(new SqlParameter("@IsKeyPivot", Convert.ToInt32(pivot.IsKeyColumn)));
            cmd.Parameters.Add(new SqlParameter("@IsApportionJoinPivot", Convert.ToInt32(pivot.IsApportionJoinColumn)));
            cmd.Parameters.Add(new SqlParameter("@PivotSourceSubType", pivot.PivotSourceSubType));
            cmd.Parameters.Add(new SqlParameter("@PivotScopeID", pivot.PivotScopeID));
            cmd.Parameters.Add(new SqlParameter("@PivotKey", pivot.PivotKey));
            cmd.Parameters.Add(new SqlParameter("@PivotSopeOperator", pivot.RelationalOperator));
            cmd.Parameters.Add(new SqlParameter("@AggregateBy", pivot.AggregateBy));
            cmd.Parameters.Add(new SqlParameter("@PivotExpression", pivot.PivotExpression));

            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        void AddVerticalsForStudy(int StudyConfigID, String vertical)
        {
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddVerticalsForStudy";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyConfigID", StudyConfigID));
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
            cmd.Parameters.Add(new SqlParameter("@PivotKey", userCreatedMetric.PivotKey));

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

        public string GetAllSourcesForGivenSourceType(string sourcetype)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllSourcesForGivenSourceType";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@SourceType", sourcetype));

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

        public string ClearPivotConfig(Pivot userConfig)
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

        public string GetPivotsForGivenSource(string source)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetPivotsFoGivenSource";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@source", source));

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

        public string GetAdminConfiguredPivotsData(string source)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAdminConfiguredPivotsData";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@source", source));

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

        public string GetUsageColumns()
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetUsageColumns";
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


        public string GetPivotsAndScopesForStudyConfigID(int StudyConfigID)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetPivotsAndScopesForStudyConfigID";
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

        public string GetAllStudyTypes()
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllStudyTypes";
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
        public string GetVerticalsForAStudyType(string StudyType)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllDefaultVerticalsForSelectedStudyType";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyType", StudyType));

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

        public void SaveVerticalsForAStudyType(StudyTypeConfig studyTypeObj)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // Delete Study type enteries from the table first
            DeleteStudyType(studyTypeObj.StudyType);

            // insert the selected data from the UI into the table
            for (int verticalCtr = 0; verticalCtr < studyTypeObj.Verticals.Length; verticalCtr++)
            {
                // prepare store procedure with necessary parameters
                var cmd = this.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = "dbo.SaveVerticalsForStudyType";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                // add any params here
                cmd.Parameters.Add(new SqlParameter("@Vertical", studyTypeObj.Verticals[verticalCtr]));
                cmd.Parameters.Add(new SqlParameter("@StudyType", studyTypeObj.StudyType));
                var reader = cmd.ExecuteReader();
                reader.Close();
            }

            this.Database.CloseConnection();
        }

        public void DeleteStudyType(string StudyType)
        {
            // Delete Study type enteries from the table first
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.DeleteStudyType";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@StudyType", StudyType));
            var reader = cmd.ExecuteReader();
            reader.Close();
        }

        public string GetStudyConfigIDsForPivotsAndScopes(Pivot[] pivots)
        {
            //ensure that connection is open
            this.Database.OpenConnection();
            StringBuilder sb = new StringBuilder();
            sb.Append("[");
            for (int i = 0; i < pivots.Length; i++)
            {
                Pivot p = pivots[i];
                // prepare store procedure with necessary parameters
                var cmd = this.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = "dbo.GetStudyConfigIDsForPivotsAndScopes";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                // add any params here
                cmd.Parameters.Add(new SqlParameter("@PivotKey", p.PivotKey));
                cmd.Parameters.Add(new SqlParameter("@AggregateBy", p.AggregateBy));

                // execute stored procedure and return json
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string sqlResult = reader.GetString(0);
                        sb.Append(sqlResult);
                        sb.Append(",");
                    }
                }
            }
            sb.Append("]");
            string str = sb.ToString();
            // remove last , from the string
            int lastCommaIdx = str.LastIndexOf(',');
            if (lastCommaIdx > 0)
            {
                str = str.Remove(lastCommaIdx, 1);
            }
            return str;
        }

    }
}

