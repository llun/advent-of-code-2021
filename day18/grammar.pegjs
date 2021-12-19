Number = "[" v1:(Value/Number) "," v2:(Value/Number) "]" { return [v1, v2] }
Value = [0-9]+ { return parseInt(text(), 10) }