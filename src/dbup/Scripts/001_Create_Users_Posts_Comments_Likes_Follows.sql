-- Create Users table
CREATE TABLE [dbo].[Users] (
    [Id] INT PRIMARY KEY IDENTITY(1, 1),
    [UserName] NVARCHAR(256) NOT NULL UNIQUE,
    [Email] NVARCHAR(256) NOT NULL UNIQUE,
    [PasswordHash] NVARCHAR(MAX) NOT NULL,
    [DisplayName] NVARCHAR(256) NOT NULL DEFAULT '',
    [Bio] NVARCHAR(MAX),
    [CreatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE()
);

-- Create Posts table
CREATE TABLE [dbo].[Posts] (
    [Id] INT PRIMARY KEY IDENTITY(1, 1),
    [UserId] INT NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL,
    [ImageUrl] NVARCHAR(MAX),
    [CreatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Posts_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE
);

-- Create Comments table
CREATE TABLE [dbo].[Comments] (
    [Id] INT PRIMARY KEY IDENTITY(1, 1),
    [PostId] INT NOT NULL,
    [UserId] INT NOT NULL,
    [Content] NVARCHAR(MAX) NOT NULL,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Comments_Posts] FOREIGN KEY ([PostId]) REFERENCES [Posts]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Comments_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE NO ACTION
);

-- Create Likes table
CREATE TABLE [dbo].[Likes] (
    [Id] INT PRIMARY KEY IDENTITY(1, 1),
    [PostId] INT NOT NULL,
    [UserId] INT NOT NULL,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Likes_Posts] FOREIGN KEY ([PostId]) REFERENCES [Posts]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Likes_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE NO ACTION,
    CONSTRAINT [UQ_Likes_PostId_UserId] UNIQUE ([PostId], [UserId])
);

-- Create Follows table
CREATE TABLE [dbo].[Follows] (
    [Id] INT PRIMARY KEY IDENTITY(1, 1),
    [FollowerId] INT NOT NULL,
    [FollowingId] INT NOT NULL,
    [CreatedAt] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Follows_Follower] FOREIGN KEY ([FollowerId]) REFERENCES [Users]([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Follows_Following] FOREIGN KEY ([FollowingId]) REFERENCES [Users]([Id]) ON DELETE NO ACTION,
    CONSTRAINT [UQ_Follows_FollowerId_FollowingId] UNIQUE ([FollowerId], [FollowingId])
);
