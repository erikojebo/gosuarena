using System.Configuration;
using System.Web.Mvc;
using GosuArena.Entities;
using GosuArena.Infrastructure;
using GosuArena.Services;
using WeenyMapper;

namespace GosuArena.Controllers
{
    public abstract class BaseController : Controller
    {
        private FileBotRepository _fileBotRepository;

        protected Repository Repository = new Repository(); 

        protected int GetCurrentUserId()
        {
            return Repository.Find<User>()
                .Where(x => x.Username == User.Identity.Name)
                .Select(x => x.Id)
                .ExecuteScalar<int>();
        }

        protected User GetUserWithBots(string username)
        {
            var user = Repository.Find<User>()
                .Where(x => x.Username == username)
                .Join(x => x.Bots, x => x.User)
                .Execute();
            return user;
        }

        protected ActionResult Error(string message)
        {
            return View("Error", (object)message);
        }
    }
}
