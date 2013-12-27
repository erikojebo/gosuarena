using GosuArena.Infrastructure;

namespace GosuArena.Models
{
    public class User
    {
        public string Username { get; set; }
        public string HashedPassword { get; set; }

        public void SetPassword(string plainTextPassword)
        {
            HashedPassword = Hash(plainTextPassword);
        }

        public bool IsPasswordValid(string plainTextPassword)
        {
            return Hash(plainTextPassword) == HashedPassword;
        }

        private static string Hash(string plainTextPassword)
        {
            return Md5Hash.Hash(plainTextPassword);
        }
    }
}