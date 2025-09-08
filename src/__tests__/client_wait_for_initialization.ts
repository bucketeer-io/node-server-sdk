/*
Testcases to cover:
- Timeout reached
  - Should clear timeout to prevent memory leaks
  - Should reject with TimeoutError
- Init successful
  - Should clear timeout to prevent memory leaks
- Init failed - by feature processor
  - Should clear timeout to prevent memory leaks
  - Should return correct BKTError
- Init failed - by segment processor
  - Should clear timeout to prevent memory leaks
  - Should return correct BKTError
- Init failed - by both processors
  - Should clear timeout to prevent memory leaks
  - Should return correct BKTError
*/

