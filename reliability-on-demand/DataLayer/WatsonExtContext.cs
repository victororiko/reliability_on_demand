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

namespace reliability_on_demand.DataLayer
{
    public class WatsonExtContext : DbContext
    {
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

        public string GetAllTeamConfigs()
        {
            return GetSQLResultsJSON("SELECT * FROM [dbo].[RELTeamConfig]");
        }

        public string AddTeam(TeamConfig inquiry)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.AddTeam";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@OwnerContact", inquiry.OwnerContact));
            cmd.Parameters.Add(new SqlParameter("@OwnerTeamFriendlyName", inquiry.OwnerTeamFriendlyName));
            cmd.Parameters.Add(new SqlParameter("@OwnerTriageAlias", inquiry.OwnerTriageAlias));

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
        public string GetAllStudyConfigsForTeam(ConfigInquiry inquiry)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            // prepare store procedure with necessary parameters
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetAllStudyConfigsForTeam";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            // add any params here
            cmd.Parameters.Add(new SqlParameter("@TeamID", inquiry.TeamID));

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
        public string GetAllMainVerticals()
        {
            return GetSQLResultsJSON("SELECT VerticalName,PivotSourceSubType FROM [dbo].[RELFailureVertical]");
        }

        //Get all pivots for that vertical
        public string GetAllailurePivotNamesForAVertical(string sourcesubtype)
        {
            string query = string.Format("SELECT PivotID,PivotSourceColumnName FROM [dbo].[RELPivotInfo] AS info INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource WHERE info.PivotSourceSubType LIKE '{0}' AND map.PivotSourceType LIKE 'Failure%'", sourcesubtype);
            return GetSQLResultsJSON(query);
        }

        //Get all defaults for that vertical
        public string GetAllDefaultFailurePivotsForAVertical(string sourcesubtype)
        {
            string query = string.Format("SELECT info.PivotID,info.PivotSourceColumnName,smap.IsSelectColumn,smap.IsKeyColumn,smap.IsApportionColumn,smap.IsApportionJoinColumn,smap.PivotScopeID,scope.PivotScopeValue,scope.PivotScopeOperator FROM RELStudyPivotConfigDefault AS smap INNER JOIN RELPivotInfo AS info ON smap.PivotKey = info.PivotKey INNER JOIN RELPivotSourceMap AS map ON info.PivotSource = map.PivotSource LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID WHERE smap.PivotSourceSubType LIKE '{0}' AND map.PivotSourceType LIKE 'Failure%'", sourcesubtype);
            string res = GetSQLResultsJSON(query);
            return res;
        }

        //Get all configured values for that vertical and study id
        public string GetAllConfiguredFailurePivotsForAVertical(string sourcesubtype, int studyid)
        {
            string query = string.Format("SELECT info.PivotID,info.PivotSourceColumnName,smap.IsApportionColumn,smap.IsApportionJoinColumn,smap.IsKeyColumn,smap.IsSelectColumn,smap.PivotScopeID,scope.PivotScopeValue,scope.PivotScopeOperator FROM RELPivotInfo AS info INNER JOIN RELStudyPivotConfig AS smap ON info.PivotID = smap.PivotID INNER JOIN RELPivotSourceMap AS map ON map.PivotSource = info.PivotSource LEFT OUTER JOIN RELPivotScope AS scope ON smap.PivotScopeID = scope.PivotScopeID WHERE smap.StudyID = {0} AND map.PivotSourceType LIKE 'Failure%' AND smap.PivotSourceSubType LIKE '{1}'", studyid, sourcesubtype);
            string res = GetSQLResultsJSON(query);
            return res;
        }

        //Update all the watson call configured parameters for a study
        public void UpdateFailureSavedConfig(FailureConfig f)
        {
            this.Database.OpenConnection();
            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = string.Format("SELECT count(*) AS count FROM RELStudyPivotConfig WHERE StudyID = {0} AND PivotSourceSubType LIKE '{1}'", f.StudyID, f.PivotSourceSubType);
            Int32 count = (Int32)cmd.ExecuteScalar();

            cmd.CommandText = "SELECT max(PivotScopeID) AS max FROM RELPivotScope";
            Int32 maxscopeid = (Int32)cmd.ExecuteScalar();

            cmd.CommandText = "SELECT max(RelationID) AS max FROM RELStudyPivotConfig";
            Int32 maxRelationId = (Int32)cmd.ExecuteScalar();

            if (count>0)
            {
                cmd.CommandText = string.Format("DELETE FROM RELPivotScope WHERE PivotScopeID IN (SELECT PivotScopeID FROM RELStudyPivotConfig WHERE StudyID={0} AND PivotSourceSubType='{1}')", f.StudyID, f.PivotSourceSubType);
                var pivotscopereader = cmd.ExecuteReader();
                pivotscopereader.Close();

                cmd.CommandText = string.Format("DELETE FROM RELStudyPivotConfig WHERE StudyID = {0} AND PivotSourceSubType LIKE '{1}'", f.StudyID, f.PivotSourceSubType);
                var reader = cmd.ExecuteReader();
                reader.Close();
            }

            this.AddFailureConfigToSQL(f,maxscopeid,maxRelationId);
            
        }


        void AddFailureConfigToSQL(FailureConfig f,int maxscopeid,int maxRelationId)
        {
            this.Database.OpenConnection();
            var scopeid = maxscopeid + 1;
            var RelationId = maxRelationId + 1;
            var cmd = this.Database.GetDbConnection().CreateCommand();
            string query = "";

            for (var i = 0; i < f.Pivots.Count; i++)
            {
                var p = f.Pivots[i];
                if (p.IsScopeFilter == true)
                {
                    
                    query += string.Format("INSERT INTO RELPivotScope(PivotScopeID,PivotScopeValue,PivotScopeOperator) VALUES({0},'{1}','{2}')", scopeid, p.FilterExpression, p.FilterExpressionOperator);
                    p.PivotScopeID = scopeid;
                    scopeid++;
                }
            }

            cmd.CommandText = query;
            var reader = cmd.ExecuteReader();
            reader.Close();
            

            var cmdInsert = this.Database.GetDbConnection().CreateCommand();
            string insertionquery = "";

            for (var i = 0; i < f.Pivots.Count; i++)
            {
                var p = f.Pivots[i];
                if (p.PivotScopeID == 0 && p.IsScopeFilter == false)
                {
                    insertionquery += string.Format("INSERT INTO RELStudyPivotConfig(RelationID,StudyID,PivotID,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType) VALUES({0},{1},{2},{3},{4},{5},{6},'{7}')", RelationId,f.StudyID, p.PivotID, Convert.ToInt32(p.IsSelectPivot), Convert.ToInt32(p.IsApportionPivot), Convert.ToInt32(p.IsKeyPivot), Convert.ToInt32(p.IsApportionJoinPivot), f.PivotSourceSubType);
                }
                else
                {
                    insertionquery += string.Format("INSERT INTO RELStudyPivotConfig(RelationID,PivotScopeID,StudyID,PivotID,IsSelectColumn,IsApportionColumn,IsKeyColumn,IsApportionJoinColumn,PivotSourceSubType) VALUES({0},{1},{2},{3},{4},{5},{6},{7},'{8}')", RelationId,p.PivotScopeID, f.StudyID, p.PivotID, Convert.ToInt32(p.IsSelectPivot), Convert.ToInt32(p.IsApportionPivot), Convert.ToInt32(p.IsKeyPivot), Convert.ToInt32(p.IsApportionJoinPivot), f.PivotSourceSubType);
                }
                RelationId++;
            }

            cmdInsert.CommandText = insertionquery;

            var insertionreader = cmdInsert.ExecuteReader();

            insertionreader.Close();

            this.Database.CloseConnection();
        }


        public string ValidateAzureFunctionCall()
        {
            return this.validateAzureFunctionKey;
        }


    }
}
