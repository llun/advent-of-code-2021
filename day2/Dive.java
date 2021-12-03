import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

record Command(String action, Integer value) {
    public static Command fromLineString(String line) {
        var parts = line.split(" ");
        return new Command(parts[0], Integer.parseInt(parts[1], 10));
    }
}
record Result(Integer aim, Integer position, Integer depth) {
    public static Result add(Result result, Command command) {
        return switch (command.action()) {
            case "forward" -> new Result(result.aim, result.position + command.value(), result.depth + (result.aim * command.value()));
            case "up" -> new Result(result.aim - command.value(),result.position,result.depth);
            case "down" -> new Result(result.aim + command.value(), result.position,result.depth);
            default -> result;
        };
    }
    public static Result sum(Result a, Result b) {
        return new Result(a.aim + b.aim, a.position + b.position, a.depth + b.depth);
    }
}

class Dive {
    public static void main(String[] args) throws IOException {
        var lines = Files.lines(Paths.get("day2/input.txt")).map(Command::fromLineString);
        var result = lines.reduce(new Result(0,0,0), Result::add, Result::sum);
        System.out.printf("Part1: %d, Part2: %d", result.aim() * result.position(), result.position() * result.depth());
    }
}