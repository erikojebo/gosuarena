GO
CREATE USER [arenauser] FOR LOGIN [arenauser] WITH DEFAULT_SCHEMA=[dbo]
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[Username] [nvarchar](255) NOT NULL,
	[HashedPassword] [nvarchar](255) NOT NULL,
	[LastLoginDate] [datetime] NULL,
	CONSTRAINT UQ_Users_Username UNIQUE(Username))
GO
