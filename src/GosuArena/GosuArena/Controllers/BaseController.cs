using System.Configuration;
using System.Web.Mvc;
using GosuArena.Entities;
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

        protected int GetCurrentUserId()
        {
            var userId = Repository.Find<User>().Where(x => x.Username == User.Identity.Name).Select(x => x.Id).ExecuteScalar<int>();
            return userId;
        }

        protected User GetUserWithBots(string username)
        {
            var user = Repository.Find<User>()
                .Where(x => x.Username == username)
                .Join(x => x.Bots, x => x.User)
                .Execute();
            return user;
        }
    }
}
