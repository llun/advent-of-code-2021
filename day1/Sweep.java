import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.function.IntFunction;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

class Index {
    public static IntFunction<List<Integer>> windowed(List<Integer> integers, int size) {
        return (i -> integers.subList(i, i + size));
    }

    public static Integer count(Integer total, List<Integer> element) {
        return (element.get(1) > element.get(0)) ? total + 1 : total;
    }

    public static void main(String[] args) throws IOException {
        var lines = Files.lines(Paths.get("day1/input.txt")).map(Integer::parseInt).collect(Collectors.toList());
        System.out.println(IntStream
                .range(0, lines.size() - 1)
                .mapToObj(windowed(lines, 2))
                .reduce(0, Index::count, Integer::sum));
        var triples = IntStream
                .range(0, lines.size() - 2)
                .mapToObj(windowed(lines, 3))
                .map(triple -> triple.stream().reduce(0, Integer::sum))
                .collect(Collectors.toList());
        System.out.println(IntStream.range(0, triples.size() - 1)
                .mapToObj(windowed(triples, 2))
                .reduce(0, Index::count, Integer::sum));
    }
}