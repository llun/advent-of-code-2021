expr = actions:(a:action newline? { return a })+ { const [p,a,d] = actions.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[0] * a[1]], [0,0,0]); return [p*a,p*d] }
action = forward / up / down
down = "down" _ v:number { return [0, v] }
up = "up" _ v:number { return [0, -v] }
forward = "forward" _ v:number { return [v, 0] }
number = [0-9]+ { return parseInt(text(), 10) }
_ = [ ]+
newline = [\n]