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
        private BotRepository _botRepository;

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

        public FileBotRepository FileBotRepository
        {
            get
            {
                if (_fileBotRepository == null)
                    _fileBotRepository = new FileBotRepository(Server.MapPath("~/Scripts/bots/"));

                return _fileBotRepository;
            }
        }

        public BotRepository BotRepository
        {
            get
            {
                if (_botRepository == null)
                    _botRepository = new BotRepository(FileBotRepository);

                return _botRepository;
            }
        }
    }
}
