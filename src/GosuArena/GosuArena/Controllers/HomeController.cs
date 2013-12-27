using System.Linq;
using System.Web.Mvc;
using GosuArena.Models;
using GosuArena.Services;

namespace GosuArena.Controllers
{
    public class HomeController : BaseController
    {
        private FileBotRepository _botRepository;

        public ActionResult Index()
        {
            _botRepository = new FileBotRepository(Server.MapPath("~/Scripts/bots/"));

            var bots = _botRepository.GetAll();

            return View(bots);
        }

        public ActionResult Users()
        {
            var users = Repository.Find<User>().ExecuteList();
            return Content(string.Join(", ", users.Select(x => x.Username)));
        }

        [Authorize]
        public ActionResult Profile()
        {
            return View();
        }
    }
}
