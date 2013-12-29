using System.Collections.Generic;
using System.IO;
using System.Linq;
using GosuArena.Entities;

namespace GosuArena.Services
{
    public class FileBotRepository
    {
        private readonly string _botDirectory;

        public FileBotRepository(string botDirectory)
        {
            _botDirectory = botDirectory;
        }

        public IList<Bot> GetAll()
        {
            var id = int.MaxValue;

            var files = Directory.GetFiles(_botDirectory, "*.js");

            var bots = files.Select(LoadBot).ToList();

            // Initialize ids of all bots
            foreach (var bot in bots)
            {
                bot.Id = id--;
            }

            return bots;
        }

        private Bot LoadBot(string path)
        {
            return new Bot()
            {
                Name = Path.GetFileNameWithoutExtension(path),
                Script = File.ReadAllText(path)
            };
        }
    }
}