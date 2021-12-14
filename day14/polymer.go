package main

import (
	"bytes"
	"fmt"
	"hash/fnv"
	"os"
	"sort"
	"strings"
	"sync"
)

func GetInput(fileName string) (string, map[string]string) {
	dat, err := os.ReadFile(fileName)
	if err != nil {
		panic(err)
	}

	parts := strings.Split(string(dat), "\n\n")
	lines := strings.Split(strings.TrimSpace(parts[1]), "\n")
	inputMap := make(map[string]string)
	for _, s := range lines {
		mapLine := strings.Split(s, " -> ")
		inputMap[mapLine[0]] = mapLine[1]
	}
	return parts[0], inputMap
}

func GetFirstMap(input map[string]string) map[uint32]string {
	result := make(map[uint32]string)
	for k, v := range input {
		word := []byte{byte(k[0]), byte(v[0]), byte(k[1])}
		result[Hash(k)] = string(word)
	}
	return result
}

func GetNextSequenceWithCache(sequence *string, cache *map[int]map[uint32]string) string {
	slots := make([]int, len(*cache))
	i := 0
	for key := range *cache {
		slots[i] = key
		i += 1
	}
	sort.Ints(slots)

	currentSlot := len(slots) - 1
	defaultSlot := currentSlot
	for slots[currentSlot] > len(*sequence) {
		currentSlot -= 1
		defaultSlot = currentSlot
	}

	begin := 0
	var result bytes.Buffer
	for {
		length := slots[currentSlot]
		endOfWord := begin + length
		if endOfWord > len(*sequence) {
			endOfWord = len(*sequence)
		}

		word := (*sequence)[begin:endOfWord]
		wordMap := (*cache)[length]
		key := Hash(word)
		if _, exists := wordMap[key]; !exists {
			currentSlot = currentSlot - 1
			continue
		}

		end := begin + length
		begin = end - 1

		if result.Len() == 0 {
			result.WriteString(wordMap[key])
		} else {
			result.WriteString(wordMap[key][1:])
		}

		if end >= len(*sequence) {
			break
		}
		currentSlot = defaultSlot
	}
	return result.String()
}

func GroupBy(sequence string) int {
	charMap := make(map[string]int)
	for _, c := range sequence {
		if _, ok := charMap[string(c)]; !ok {
			charMap[string(c)] = 0
		}
		charMap[string(c)] += 1
	}

	countMap := make(map[int]string)
	for k, v := range charMap {
		countMap[v] = k
	}

	keys := make([]int, 0, len(countMap))
	for k := range countMap {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	return keys[len(keys)-1] - keys[0]
}

func Hash(input string) uint32 {
	hash := fnv.New32a()
	hash.Write([]byte(input))
	return hash.Sum32()
}

func main() {
	sequence, inputMap := GetInput("input.txt")

	cache := make(map[int]map[uint32]string)
	cache[2] = GetFirstMap(inputMap)

	slot := 2
	for i := 0; i < 26; i++ {
		fmt.Println("Pre generate", i)
		keyLen := -1
		newMap := make(map[uint32]string)
		var wg sync.WaitGroup
		var lock = sync.RWMutex{}
		for _, v := range cache[slot] {
			if keyLen == -1 {
				keyLen = len(v)
			}

			wg.Add(1)
			go func(sequence string) {
				lock.Lock()
				defer wg.Done()
				defer lock.Unlock()
				newMap[Hash(sequence)] = GetNextSequenceWithCache(&sequence, &cache)
			}(v)

		}
		wg.Wait()
		cache[keyLen] = newMap
		slot = keyLen
	}

	slots := make([]int, len(cache))
	i := 0
	for key := range cache {
		slots[i] = key
		i += 1
	}
	sort.Ints(slots)

	val := sequence
	for i := 0; i < 40; i++ {
		val = GetNextSequenceWithCache(&val, &cache)
		fmt.Println(i, len(val))
	}

	// Clear map
	cache = nil

	fmt.Println(GroupBy(val))
}
