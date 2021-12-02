import java.io.File

println(File("input.txt").readLines().map { it.toInt(10) }.windowed(2).count { (a,b) -> b > a })