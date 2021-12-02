import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

class Index {
    public static void main(String args[]) throws IOException {
        var lines = Files.lines(Paths.get("day1/input.txt")).map(Integer::parseInt).collect(Collectors.toList());
        System.out.println(IntStream.range(0, lines.size() - 1).mapToObj(i -> List.of(lines.get(i), lines.get(i + 1))).reduce(0, (total, element) -> (element.get(1) > element.get(0)) ? total + 1 : total, Integer::sum));
    }
}