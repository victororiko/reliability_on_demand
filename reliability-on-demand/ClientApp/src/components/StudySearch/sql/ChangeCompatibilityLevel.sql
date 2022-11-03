--- check comptability level
USE ReliabilityReporting;  
GO  

-- Previous compatibility_level  = 120
SELECT compatibility_level  
FROM sys.databases WHERE name = 'ReliabilityReporting';  
GO


ALTER DATABASE ReliabilityReporting  
SET COMPATIBILITY_LEVEL = 160;  
GO

-- New compatibility_level  = 160
SELECT compatibility_level  
FROM sys.databases WHERE name = 'ReliabilityReporting';  
GO
