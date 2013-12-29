using System.Collections;
using System.Collections.Generic;
using System.Linq;
using GosuArena.Entities;
using WeenyMapper;

namespace GosuArena.Services
{
    public class BotRepository
    {
        private readonly FileBotRepository _fileBotRepository;
        private readonly Repository _repository = new Repository();

        public BotRepository(FileBotRepository fileBotRepository)
        {
            _fileBotRepository = fileBotRepository;
        }

        public IList<Bot> GetAll()
        {
            var fileBots = _fileBotRepository.GetAll()
                .OrderBy(x => x.Name);

            var databaseBots = _repository.Find<Bot>()
                .Join(x => x.User)
                .OrderBy(x => x.Name)
                .ExecuteList();

            return fileBots.Union(databaseBots).ToList();
        }
    }
}