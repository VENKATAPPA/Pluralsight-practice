using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Api.Data;
using SocialMediaApp.Api.DTOs;
using SocialMediaApp.Api.Models;

namespace SocialMediaApp.Api.Controllers
{
    [ApiController]
    [Route("api/posts/{postId:int}/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CommentsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetAll(int postId)
        {
            var comments = _db.Comments.Where(c => c.PostId == postId).Include(c => c.User).OrderBy(c => c.CreatedAt).ToList();
            return Ok(comments);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(int postId, CreateCommentDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var post = _db.Posts.Find(postId);
            if (post == null) return NotFound();

            var c = new Comment { PostId = postId, UserId = userId.Value, Content = dto.Content };
            _db.Comments.Add(c);
            await _db.SaveChangesAsync();
            return Ok(c);
        }

        private int? GetCurrentUserId()
        {
            var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (int.TryParse(idClaim, out var id)) return id;
            return null;
        }
    }
}
