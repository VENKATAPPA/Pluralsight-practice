using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Api.Data;
using SocialMediaApp.Api.Models;
using SocialMediaApp.Api.DTOs;

namespace SocialMediaApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PostsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("feed")]
        [Authorize]
        public IActionResult Feed(int page = 1, int pageSize = 20)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var following = _db.Follows.Where(f => f.FollowerId == userId).Select(f => f.FollowingId);
            var posts = _db.Posts
                .Where(p => following.Contains(p.UserId))
                .Include(p => p.User)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new {
                    p.Id,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedAt,
                    User = new { p.User.Id, p.User.UserName, p.User.DisplayName },
                    CommentsCount = p.Comments.Count,
                    LikesCount = p.Likes.Count
                })
                .ToList();

            return Ok(posts);
        }

        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            var post = _db.Posts.Include(p => p.User).Include(p => p.Comments).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return Ok(post);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreatePostDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var p = new Post { UserId = userId.Value, Content = dto.Content, ImageUrl = dto.ImageUrl };
            _db.Posts.Add(p);
            await _db.SaveChangesAsync();
            return Ok(p);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, CreatePostDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var post = _db.Posts.Find(id);
            if (post == null) return NotFound();
            if (post.UserId != userId) return Forbid();

            post.Content = dto.Content;
            post.ImageUrl = dto.ImageUrl;
            await _db.SaveChangesAsync();
            return Ok(post);
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var post = _db.Posts.Find(id);
            if (post == null) return NotFound();
            if (post.UserId != userId) return Forbid();

            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();
            return Ok();
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
