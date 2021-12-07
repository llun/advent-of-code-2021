def part_2(data):
    m = int(mean(data))
    return sum(sum(range(abs(d-m)+1)) for d in data)
