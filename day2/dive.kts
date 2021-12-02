import java.io.File

val lines = File("input.txt")
    .readLines()
    .map { line -> line.split(' ') }

val (aim, position, depth) = lines.fold(listOf(0,0,0), {acc, item ->
    val (command, value) = item
    val num = value.toInt(10)
    val (aim, position, depth) = acc
    when(command) {
        "forward" -> listOf(aim, position + num, depth + num * aim)
        "down" -> listOf(aim + num, position, depth)
        "up" -> listOf(aim - num, position, depth)
        else -> acc
    }})

// Part 1
println(position * aim)
// Part 2
println(position * depth)
