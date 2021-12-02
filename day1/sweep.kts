import java.io.File

println(File("input.txt").readLines().map { it.toInt(10) }.windowed(2).count { (a, b) -> b > a })
println(
    File("input.txt").readLines().map { it.toInt(10) }.windowed(3).map { it.sum() }.windowed(2)
        .count { (a, b) -> b > a })