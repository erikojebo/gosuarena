using System.Configuration;
using System.Web.Mvc;
using GosuArena.Infrastructure;
using WeenyMapper;

namespace GosuArena.Controllers
{
    public abstract class BaseController : Controller
    {
        protected Repository Repository;

        protected BaseController()
        {
            Repository = new Repository
            {
                ConnectionString = ConfigurationManager.ConnectionStrings["GosuArena"].ConnectionString,
                Convention = new DatabaseConvention()
            };
        }

        protected override void OnException(ExceptionContext filterContext)
        {
        }
    }
}
