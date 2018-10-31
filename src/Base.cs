public class Point
{
	public int X {get;set;}
	public int Y {get;set;}
	
	public bool HasMine {get;set;}
	public bool HasFlag {get;set;}
	public bool IsExplored {get;set;}
	
	public int NearByMineCounter {get;set;}
	
	public Point(int x, int y)
	{
		X = x;
		Y = y;
	}
	
	public Point GetNewPointForDelta((int x, int y) delta)
	{
		return new Point(X + delta.x, Y + delta.y);
	}
	
	public override bool Equals(object obj)
    {
        return obj is Point point &&
               X == point.X &&
               Y == point.Y;
    }

    public override int GetHashCode()
    {
        var hashCode = 1861411795;
        hashCode = hashCode * -1521134295 + X.GetHashCode();
        hashCode = hashCode * -1521134295 + Y.GetHashCode();
        return hashCode;
    }
}

public class Field
{
	private static readonly Random Rnd = new Random();
	public int Height {get; }
	public int Width {get; }
	
	public Point[] Points {get;set;}
	
	
	private Field(int height, int width)
	{
		Height = height;
		Width = width;
	}
	
	public Point[] GetNeighbours(Point point)
	{
		var neighbours = new List<(int x, int y)>();
	
		for(var i = point.X - 1; i <= point.X + 1 && i <= Width; i++)
		{
			for(var j = point.Y - 1; j <= point.Y + 1 && j <= Height; j++)
			{
				var neighbourX = i < 1 ? 1 : i;
				var neighbourY = j < 1 ? 1 : j;
				if((neighbourX == point.X && neighbourY == point.Y) || neighbours.Contains((neighbourX, neighbourY)))
				{
					// Ignore the initial point and already listed points
					continue;
				}
				neighbours.Add((neighbourX, neighbourY));
			}
		}
		
		return Points.Where(p => neighbours.Any(n => n.x == p.X && n.y == p.Y)).ToArray();
	}
	
	public static Field CreateField(int height, int width)
	{
		if(height < 1 || width < 1)
		{
			throw new InvalidOperationException("The field must be at least 1x1");
		}
		
		var field = new Field(height, width);
		var points = new List<Point>();
		
		for(int i = 1; i <= width; i++)
		{
			for(int j = 1; j <= height; j++)
			{
				points.Add(new Point(i,j));
			}
		}
		
		field.Points = points.ToArray();
		return field;
	}
	
	public void PlaceMines(int mineCount)
	{
		if(Points == null || !Points.Any())
		{
			throw new InvalidOperationException("Field does not have any points defined.");
		}
		
		if(mineCount >= Points.Count())
		{
			throw new InvalidOperationException("At least one non mine point required");
		}
		
		var minePoints = Points.OrderBy(p => Rnd.Next()).Take(mineCount);
		foreach(var minePoint in minePoints)
		{
			minePoint.HasMine = true;
		}
	}
	
	public void CalcNearBy()
	{
		foreach(var point in Points)
		{
			if(point.HasMine)
			{
				// No need to calculate near by count for mine points
				continue;
			}
			
			point.NearByMineCounter = GetNeighbours(point).Count(n => n.HasMine);
		}
	}
	
	public bool Explore(Point point)
	{
		if(point.HasFlag)
		{
			// If the field is flagged, do nothing
			return true;
		}
		
		if(point.HasMine)
		{
			// Game over
			point.IsExplored = true;
			return false;
		}

		if(point.NearByMineCounter > 0)
		{
			point.IsExplored = true;
			return true;
		}
		
		ExploreNeighbours(point);
		return true;
	}
	
	private void ExploreNeighbours(Point point)
	{
		StarExploration(point);
	}
	
	private void StarExploration(Point point)
	{
		this.Draw();
		Task.Delay(50).Wait();
		
		var currentPoint = Points.FirstOrDefault(p => p.Equals(point));
		
		
		if(currentPoint == null || currentPoint.IsExplored)
		{
			return;
		}
		
		currentPoint.IsExplored = true;
		
		if(currentPoint.NearByMineCounter > 0)
		{
			return;
		}

		
		StarExploration(new Point(currentPoint.X - 1, currentPoint.Y + 1));
		StarExploration(new Point(currentPoint.X - 1, currentPoint.Y + 0));
		StarExploration(new Point(currentPoint.X - 1, currentPoint.Y - 1));
		StarExploration(new Point(currentPoint.X + 0, currentPoint.Y - 1));
		StarExploration(new Point(currentPoint.X + 1, currentPoint.Y - 1));
		StarExploration(new Point(currentPoint.X + 1, currentPoint.Y + 0));
		StarExploration(new Point(currentPoint.X + 1, currentPoint.Y + 1));
		StarExploration(new Point(currentPoint.X + 0, currentPoint.Y + 1));
	}
	
	public void Draw()
	{
		Util.ClearResults();
		
		var orderedPoints = Points.OrderByDescending(p => p.Y).ThenBy(p => p.X);	
		var currentRow = 0;
		
		foreach(var point in orderedPoints)
		{
			if(point.Y != currentRow)
			{
				currentRow = point.Y;
				Console.WriteLine();
			}
			
			var pointStr = string.Empty;
			if(point.IsExplored)
			{
				if(point.HasMine)
				{
					pointStr = "x";
				}
				else
				{
					pointStr = point.NearByMineCounter.ToString();
				}
			}
			else
			{
				if(point.HasFlag)
				{
					pointStr = "+";
				}
				else
				{
					pointStr = "*";
				}
			}
			
			Console.Write($"[{pointStr}]");
		}
		
		Console.WriteLine();
	}
}

public class Game
{
	public Field _field;
	private DateTime _startTime;
	private DateTime _endTime;
	private TimeSpan _currentDuration => DateTime.Now - _startTime;

	private Game()
	{
	
	}
	
	public static Game CreateGame(Config config)
	{
		var game = new Game();
		game._field = Field.CreateField(config.FieldWidth, config.FieldHeight);
		game._field.PlaceMines(config.MineCount);
		game._field.CalcNearBy();
		
//		game._field.Dump();
		
		return game;
	}
	
	public void Draw()
	{
		_field.Draw();
	}

	public class Config
	{
		public int FieldWidth {get;set;}
		public int FieldHeight {get;set;}
		public int MineCount {get;set;}
	}
}

void Main()
{
	var config = new Game.Config();
	config.FieldWidth = 9;
	config.FieldHeight = 9;
	config.MineCount = 10;
	
	var game = Game.CreateGame(config);
	
	game.Draw();
	
	game._field.Explore(game._field.Points.First(p => p.Equals(new Point(2,3)))).Dump();
	
	game.Draw();
}
