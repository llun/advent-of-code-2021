import java.io.File

val lines = File("input.txt")
    .readLines()
    .map { line -> line.split(' ') }

// Part 1
val (forward, down, up) = lines
    .groupBy { it[0] }
    .entries
    .map { entry ->
        entry.value.fold(0) { acc, list -> acc + list[1].toInt(10) }
    }
println(forward * (down - up))

// Part 2
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
println(position * depth)