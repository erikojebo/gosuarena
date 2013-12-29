using System;
using System.ComponentModel.DataAnnotations;

namespace GosuArena.Entities
{
    public class Bot
    {
        public Bot()
        {
            CreatedDate = DateTime.Now;
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        [StringLength(255, ErrorMessage = "Bot name is too long")]
        public string Name { get; set; }

        public string Script { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}