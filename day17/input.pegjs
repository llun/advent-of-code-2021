Input = "target area: " x:Range ", " y:Range { return { x, y } }
Range = ("x="/"y=") from:Number ".." to:Number { return [from, to] }
Number = "-"? [0-9]+ { return parseInt(text(), 10) }