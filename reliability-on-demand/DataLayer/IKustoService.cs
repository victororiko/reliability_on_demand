using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reliability_on_demand.DataLayer
{
    public interface IKustoService
    {
        string GetAllReleases();
    }
}
