using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using reliability_on_demand.Extensions;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Xml.Serialization;

namespace reliability_on_demand.DataLayer
{
    public class WatsonExtContext : DbContext
    {
        private string connectionString = null;

        public WatsonExtContext(IOptions<ValueSettings> valueSettings, DbContextOptions options) : base(options)
        {
            connectionString = valueSettings.Value.SQLConnectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(connectionString);
        }

        private SqlParameter[] CreateCommonInquiryParamList(StackInquiry inquiry)
        {
            List<SqlParameter> _params = new List<SqlParameter>();

            _params.Add(new SqlParameter("@failurehash", inquiry.FailureHash.ToString()));

            if (!string.IsNullOrEmpty(inquiry.ProcessName))
            {
                _params.Add(new SqlParameter("@processname", inquiry.ProcessName));
            }

            if (!string.IsNullOrEmpty(inquiry.PackageVersion))
            {
                _params.Add(new SqlParameter("@packageversion", inquiry.PackageVersion));
            }

            if (!string.IsNullOrEmpty(inquiry.Branch))
            {
                _params.Add(new SqlParameter("@branch", inquiry.Branch));
            }

            if (inquiry.MinBuild != null)
            {
                _params.Add(new SqlParameter("@minbuild", inquiry.MinBuild.Value));
            }

            if (inquiry.MaxBuild != null)
            {
                _params.Add(new SqlParameter("@maxbuild", inquiry.MaxBuild.Value));
            }

            if (inquiry.Frame != null && inquiry.Frame.ID != 0)
            {
                _params.Add(new SqlParameter("@category", inquiry.Frame.ID));
            }

            return _params.ToArray();
        }

        
        public List<Guid> GetStackHashCabs(StackInquiry inquiry)
        {
            List<Guid> results = new List<Guid>();

            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.GetStackHashCabs";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@stackhash", inquiry.StackHash));

            if (inquiry.CabGuid != null)
            {
                cmd.Parameters.Add(new SqlParameter("@cabguid", inquiry.CabGuid.Value.ToString()));
            }

            cmd.Parameters.AddRange(CreateCommonInquiryParamList(inquiry));

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    results.Add(reader.GetGuid(0));
                }
            }

            return results;
        }

        public int LogRelCloudQuery<T>(string username, string url, string access = "post", T payload = default(T))
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.LogRelCloudQuery";
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

        public void UpdateRelCloudQuery(int queryID, bool status = true, string exception = null)
        {
            //ensure that connection is open
            this.Database.OpenConnection();

            var cmd = this.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = "dbo.UpdateRelCloudQuery";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@queryID", queryID));
            cmd.Parameters.Add(new SqlParameter("@status", status));
            cmd.Parameters.Add(new SqlParameter("@exception", exception));

            cmd.ExecuteNonQuery();
        }

        
    }
}
