// Original function app: RIODStandardizeStudyPivots

#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

/**
 * Converts a sparse list of Pivots into a standardized list of supported RIOD pivots
 */

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    log.LogInformation("C# HTTP trigger function processed a request.");

    List<InputPivotEntry> list = data.ToObject<List<InputPivotEntry>>();

    Dictionary<string, OutputPivotEntry> inputPivots = new Dictionary<string, OutputPivotEntry>();
    foreach (InputPivotEntry e in list) {
        if (e.PivotName.Equals("MinBuild") ||
            e.PivotName.Equals("MaxBuild") || 
            e.PivotName.Equals("MinRevision") || 
            e.PivotName.Equals("MaxRevision"))
            inputPivots.Add(e.PivotName, new OutputPivotEntryInt(Int32.Parse(e.ScopeValue), e.AggregateByPivot));
        else
            inputPivots.Add(e.PivotName, new OutputPivotEntryStr(e.ScopeValue, e.AggregateByPivot));
    }


    OutputPivots op = new OutputPivots (
        inputPivots.GetValueOrDefault("MaxBuild", null) as OutputPivotEntryInt,
        inputPivots.GetValueOrDefault("MinBuild", null) as OutputPivotEntryInt,
        inputPivots.GetValueOrDefault("MaxRevision", null) as OutputPivotEntryInt,
        inputPivots.GetValueOrDefault("MinRevision", null) as OutputPivotEntryInt,
        inputPivots.GetValueOrDefault("FlightRing", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("BuildBranch", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("OEMName", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("OEMModel", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("DeviceFamily", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("WPId", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("OSSKU", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("OSArchitecture", null) as OutputPivotEntryStr,
        inputPivots.GetValueOrDefault("ProcessorModel", null) as OutputPivotEntryStr
    );
    
    string retType = req.Headers["return"] == StringValues.Empty ? "" : req.Headers["return"].ToString();

    if(retType.Equals("values")){
        return new OkObjectResult(JsonConvert.SerializeObject( new OutputPivotValues(op) ));
    } else if (retType.Equals("aggregations")) {
        return new OkObjectResult(JsonConvert.SerializeObject( new OutputPivotAggregations(op) ));
    } else {
        return new OkObjectResult(JsonConvert.SerializeObject( op ));
    }
}

interface OutputPivotEntry{};

public class InputPivotEntry {
    public string PivotName;
    public bool AggregateByPivot;
    public string ScopeValue;
}

public class OutputPivotEntryInt : OutputPivotEntry {
    public int value { get; set; }
    public bool aggregate { get; set; }

    public OutputPivotEntryInt () {
        this.value = 0;
        this.aggregate = false;
    }

    public OutputPivotEntryInt (int val) {
        this.value = val;
        this.aggregate = false;
    }

    public OutputPivotEntryInt (bool agg) {
        this.value = 0;
        this.aggregate = agg;
    }

    public OutputPivotEntryInt (int val, bool agg) {
        this.value = val;
        this.aggregate = agg;
    }
}

public class OutputPivotEntryStr : OutputPivotEntry {

    public string value { get; set; }
    public bool aggregate { get; set; }

    public OutputPivotEntryStr () {
        this.value = "ALL";
        this.aggregate = false;
    }

    public OutputPivotEntryStr (string val) {
        this.value = val;
        this.aggregate = false;
    }

    public OutputPivotEntryStr (bool agg) {
        this.value = "ALL";
        this.aggregate = agg;
    }

    public OutputPivotEntryStr (string val, bool agg) {
        this.value = val;
        this.aggregate = agg;
    }
}

public class OutputPivots {
    public OutputPivotEntryInt MaxBuild { get; set; }
    public OutputPivotEntryInt MinBuild { get; set; }
    public OutputPivotEntryInt MaxRevision { get; set; }
    public OutputPivotEntryInt MinRevision { get; set; }
    public OutputPivotEntryStr FlightRing { get; set; }
    public OutputPivotEntryStr BuildBranch { get; set; }
    public OutputPivotEntryStr OEMName { get; set; }
    public OutputPivotEntryStr OEMModel { get; set; }
    public OutputPivotEntryStr DeviceFamily { get; set; }
    public OutputPivotEntryStr WPId { get; set; }
    public OutputPivotEntryStr OSSKU { get; set; }
    public OutputPivotEntryStr OSArchitecture { get; set; }
    public OutputPivotEntryStr ProcessorModel { get; set; }

    public OutputPivots (
        OutputPivotEntryInt MaxBuild,
        OutputPivotEntryInt MinBuild,
        OutputPivotEntryInt MaxRevision,
        OutputPivotEntryInt MinRevision,
        OutputPivotEntryStr FlightRing,
        OutputPivotEntryStr BuildBranch,
        OutputPivotEntryStr OEMName,
        OutputPivotEntryStr OEMModel,
        OutputPivotEntryStr DeviceFamily,
        OutputPivotEntryStr WPId,
        OutputPivotEntryStr OSSKU,
        OutputPivotEntryStr OSArchitecture,
        OutputPivotEntryStr ProcessorModel
    ) {
        this.MaxBuild = MaxBuild == null ? new OutputPivotEntryInt(1000000) : MaxBuild;
        this.MinBuild = MinBuild == null ? new OutputPivotEntryInt() : MinBuild;
        this.MaxRevision = MaxRevision == null ? new OutputPivotEntryInt(1000000) : MaxRevision;
        this.MinRevision = MinRevision == null ? new OutputPivotEntryInt() : MinRevision;
        this.FlightRing = FlightRing == null ? new OutputPivotEntryStr() : FlightRing;
        this.BuildBranch = BuildBranch == null ? new OutputPivotEntryStr() : BuildBranch;
        this.OEMName = OEMName == null ? new OutputPivotEntryStr() : OEMName;
        this.OEMModel = OEMModel == null ? new OutputPivotEntryStr() : OEMModel;
        this.DeviceFamily = DeviceFamily == null ? new OutputPivotEntryStr() : DeviceFamily;
        this.WPId = WPId == null ? new OutputPivotEntryStr() : WPId;
        this.OSSKU = OSSKU == null ? new OutputPivotEntryStr() : OSSKU;
        this.OSArchitecture = OSArchitecture == null ? new OutputPivotEntryStr() : OSArchitecture;
        this.ProcessorModel = ProcessorModel == null ? new OutputPivotEntryStr() : ProcessorModel;
    }
}


public class OutputPivotValues {
    public int MaxBuild { get; set; }
    public int MinBuild { get; set; }
    public int MaxRevision { get; set; }
    public int MinRevision { get; set; }
    public string FlightRing { get; set; }
    public string BuildBranch { get; set; }
    public string OEMName { get; set; }
    public string OEMModel { get; set; }
    public string DeviceFamily { get; set; }
    public string WPId { get; set; }
    public string OSSKU { get; set; }
    public string OSArchitecture { get; set; }
    public string ProcessorModel { get; set; }

    public OutputPivotValues (
        OutputPivots op
    ) {
        this.MaxBuild = op.MaxBuild.value;
        this.MinBuild = op.MinBuild.value;
        this.MaxRevision = op.MaxRevision.value;
        this.MinRevision = op.MinRevision.value;
        this.FlightRing = op.FlightRing.value;
        this.BuildBranch = op.BuildBranch.value;
        this.OEMName = op.OEMName.value;
        this.OEMModel = op.OEMModel.value;
        this.DeviceFamily = op.DeviceFamily.value;
        this.WPId = op.WPId.value;
        this.OSSKU = op.OSSKU.value;
        this.OSArchitecture = op.OSArchitecture.value;
        this.ProcessorModel = op.ProcessorModel.value;
    }
}

public class OutputPivotAggregations {
    public bool MaxBuild { get; set; }
    public bool MinBuild { get; set; }
    public bool MaxRevision { get; set; }
    public bool MinRevision { get; set; }
    public bool FlightRing { get; set; }
    public bool BuildBranch { get; set; }
    public bool OEMName { get; set; }
    public bool OEMModel { get; set; }
    public bool DeviceFamily { get; set; }
    public bool WPId { get; set; }
    public bool OSSKU { get; set; }
    public bool OSArchitecture { get; set; }
    public bool ProcessorModel { get; set; }

    public OutputPivotAggregations (
        OutputPivots op
    ) {
        this.MaxBuild = op.MaxBuild.aggregate;
        this.MinBuild = op.MinBuild.aggregate;
        this.MaxRevision = op.MaxRevision.aggregate;
        this.MinRevision = op.MinRevision.aggregate;
        this.FlightRing = op.FlightRing.aggregate;
        this.BuildBranch = op.BuildBranch.aggregate;
        this.OEMName = op.OEMName.aggregate;
        this.OEMModel = op.OEMModel.aggregate;
        this.DeviceFamily = op.DeviceFamily.aggregate;
        this.WPId = op.WPId.aggregate;
        this.OSSKU = op.OSSKU.aggregate;
        this.OSArchitecture = op.OSArchitecture.aggregate;
        this.ProcessorModel = op.ProcessorModel.aggregate;
    }
}
