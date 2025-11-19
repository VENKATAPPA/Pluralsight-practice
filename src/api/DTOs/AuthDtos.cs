namespace SocialMediaApp.Api.DTOs
{
    public class RegisterDto
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? DisplayName { get; set; }
    }

    public class LoginDto
    {
        public string UserName { get; set; } = null!; // username or email
        public string Password { get; set; } = null!;
    }
}
