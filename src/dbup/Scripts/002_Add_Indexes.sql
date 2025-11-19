-- Add indexes for improved query performance
CREATE INDEX [IX_Posts_UserId] ON [dbo].[Posts]([UserId]);
CREATE INDEX [IX_Comments_PostId] ON [dbo].[Comments]([PostId]);
CREATE INDEX [IX_Comments_UserId] ON [dbo].[Comments]([UserId]);
CREATE INDEX [IX_Likes_PostId] ON [dbo].[Likes]([PostId]);
CREATE INDEX [IX_Likes_UserId] ON [dbo].[Likes]([UserId]);
CREATE INDEX [IX_Follows_FollowerId] ON [dbo].[Follows]([FollowerId]);
CREATE INDEX [IX_Follows_FollowingId] ON [dbo].[Follows]([FollowingId]);
