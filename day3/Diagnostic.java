import java.lang.reflect.Array;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;


public class Diagnostic {
    public static String[][] transpose(String[][] matrix) {
        var result = new String[matrix[0].length][matrix.length];
        for (var i = 0; i < matrix[0].length; i++) {
            for (var j = 0; j < matrix.length; j++) {
                result[i][j] = matrix[j][i];
            }
        }
        return result;
    }

    public static String[][] getInputMatrix(List<String[]> input) {
        return input.toArray(new String[input.get(0).length][input.size()]);
    }

    public static void main(String[] args) throws Exception {
        var lines = Files
                .lines(Paths.get("day3/input.txt"))
                .map(line -> line.split(""))
                .collect(Collectors.toList());
        var matrix = transpose(getInputMatrix(lines));
        var map = Arrays
                .stream(matrix)
                .map(arr -> new Long[] {Arrays.stream(arr).filter(i -> i.equals("0")).count(), Arrays.stream(arr).filter(i -> i.equals("1")).count()})
                .collect(Collectors.toList())
                .toArray(new Long[2][matrix.length]);
        // Part 1
        var gamma = Integer.parseInt(String.join("", Arrays.stream(map).map(arr -> arr[0] > arr[1] ? "0" : "1").collect(Collectors.toList())), 2);
        var epsilon = Integer.parseInt(String.join("", Arrays.stream(map).map(arr -> arr[0] < arr[1] ? "0" : "1").collect(Collectors.toList())), 2);
        System.out.println(gamma * epsilon);
    }
}
