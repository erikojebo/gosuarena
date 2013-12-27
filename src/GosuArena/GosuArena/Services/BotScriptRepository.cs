using System.Collections.Generic;
using System.IO;
using System.Linq;
using GosuArena.Models;

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
            var files = Directory.GetFiles(_botDirectory, "*.js");

            return files.Select(LoadBot).ToList();
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