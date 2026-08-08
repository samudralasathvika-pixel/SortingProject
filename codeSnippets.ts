// Multi-language code snippets for each algorithm.
// IMPORTANT: line numbers in each snippet align with the `line` field
// emitted by the corresponding generateSteps() function, so highlighting
// works identically across languages.

export type CodeLanguage = "java" | "c" | "cpp" | "python";

export const LANGUAGES: { id: CodeLanguage; label: string }[] = [
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
];

// ─── Bubble Sort ───────────────────────────────────────────────
// Action lines used by generator: 5 (compare), 8 (swap), 3 & 12 (mark-sorted)
const bubble: Record<CodeLanguage, string> = {
  java: `void bubbleSort(int[] a) {
  int n = a.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        int temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }
}`,
  c: `void bubbleSort(int a[], int n) {
  // n elements
  // outer loop
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        int temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }
}`,
  cpp: `void bubbleSort(vector<int>& a) {
  int n = a.size();
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        int temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }
}`,
  python: `def bubble_sort(a):
  n = len(a)
  for i in range(n - 1):
    for j in range(n - i - 1):
      if a[j] > a[j + 1]:
        tmp = a[j]
        a[j] = a[j + 1]
        a[j + 1] = tmp
      # end if
    # end inner
  # end outer`,
};

// ─── Insertion Sort ────────────────────────────────────────────
// Action lines: 4 (active/key), 7 (compare), 8 (overwrite), 11 (place key), 13 (sorted)
const insertion: Record<CodeLanguage, string> = {
  java: `void insertionSort(int[] a) {
  int n = a.length;
  for (int i = 1; i < n; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j = j - 1;
    }
    a[j + 1] = key;
  }
}`,
  c: `void insertionSort(int a[], int n) {
  // pass length n
  for (int i = 1; i < n; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j = j - 1;
    }
    a[j + 1] = key;
  }
}`,
  cpp: `void insertionSort(vector<int>& a) {
  int n = a.size();
  for (int i = 1; i < n; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j = j - 1;
    }
    a[j + 1] = key;
  }
}`,
  python: `def insertion_sort(a):
  n = len(a)
  for i in range(1, n):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
      a[j + 1] = a[j]
      j = j - 1
    a[j + 1] = key
  # done
  return a`,
};

// ─── Selection Sort ────────────────────────────────────────────
// Action lines: 4 (init minIdx), 7 (compare), 8 (update minIdx), 13 (swap), 14/15 (sorted)
const selection: Record<CodeLanguage, string> = {
  java: `void selectionSort(int[] a) {
  int n = a.length;
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    int temp = a[minIdx];
    a[minIdx] = a[i];
    a[i] = temp;
  }
}`,
  c: `void selectionSort(int a[], int n) {
  // pass length n
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    int temp = a[minIdx];
    a[minIdx] = a[i];
    a[i] = temp;
  }
}`,
  cpp: `void selectionSort(vector<int>& a) {
  int n = a.size();
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    int temp = a[minIdx];
    a[minIdx] = a[i];
    a[i] = temp;
  }
}`,
  python: `def selection_sort(a):
  n = len(a)
  for i in range(n - 1):
    min_idx = i
    for j in range(i + 1, n):
      if a[j] < a[min_idx]:
        min_idx = j
      # end if
    # end inner
    tmp = a[min_idx]
    a[min_idx] = a[i]
    a[i] = tmp
  # done`,
};

// ─── Quick Sort ────────────────────────────────────────────────
// Action lines: 2 (active range), 8 (final mark), 10 (set-pivot), 13 (compare),
// 15 (swap), 18 (final partition swap), 19 (mark pivot sorted)
const quick: Record<CodeLanguage, string> = {
  java: `void quickSort(int[] a, int low, int high) {
  if (low < high) {
    int p = partition(a, low, high);
    quickSort(a, low, p - 1);
    quickSort(a, p + 1, high);
  }
}
int partition(int[] a, int low, int high) {
  int pivot = a[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (a[j] < pivot) {
      i++;
      int t = a[i]; a[i] = a[j]; a[j] = t;
    }
  }
  int t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
  return i + 1;
}`,
  c: `void quickSort(int a[], int low, int high) {
  if (low < high) {
    int p = partition(a, low, high);
    quickSort(a, low, p - 1);
    quickSort(a, p + 1, high);
  }
}
int partition(int a[], int low, int high) {
  int pivot = a[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (a[j] < pivot) {
      i++;
      int t = a[i]; a[i] = a[j]; a[j] = t;
    }
  }
  int t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;
  return i + 1;
}`,
  cpp: `void quickSort(vector<int>& a, int low, int high) {
  if (low < high) {
    int p = partition(a, low, high);
    quickSort(a, low, p - 1);
    quickSort(a, p + 1, high);
  }
}
int partition(vector<int>& a, int low, int high) {
  int pivot = a[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (a[j] < pivot) {
      i++;
      swap(a[i], a[j]);
      // swap done
    }
  }
  swap(a[i + 1], a[high]);
  return i + 1;
}`,
  python: `def quick_sort(a, low, high):
  if low < high:
    p = partition(a, low, high)
    quick_sort(a, low, p - 1)
    quick_sort(a, p + 1, high)
  # done

def partition(a, low, high):
  pivot = a[high]
  i = low - 1
  for j in range(low, high):
    if a[j] < pivot:
      i += 1
      a[i], a[j] = a[j], a[i]
    # end if
  # end for
  a[i + 1], a[high] = a[high], a[i + 1]
  return i + 1`,
};

// ─── Merge Sort ────────────────────────────────────────────────
// Action lines: 3 (active), 8 (mark merged), 9 (final), 15 (compare/L write),
// 16 (R write), 18 (drain L), 19 (drain R)
const merge: Record<CodeLanguage, string> = {
  java: `void mergeSort(int[] a, int l, int r) {
  if (l < r) {
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
  }
}
void merge(int[] a, int l, int m, int r) {
  int[] L = Arrays.copyOfRange(a, l, m + 1);
  int[] R = Arrays.copyOfRange(a, m + 1, r + 1);
  int i = 0, j = 0, k = l;
  while (i < L.length && j < R.length) {
    if (L[i] <= R[j]) a[k++] = L[i++];
    else a[k++] = R[j++];
  }
  while (i < L.length) a[k++] = L[i++];
  while (j < R.length) a[k++] = R[j++];
}`,
  c: `void mergeSort(int a[], int l, int r) {
  if (l < r) {
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
  }
}
void merge(int a[], int l, int m, int r) {
  int n1 = m - l + 1, n2 = r - m;
  int L[n1], R[n2];
  for (int x = 0; x < n1; x++) L[x] = a[l + x];
  for (int y = 0; y < n2; y++) R[y] = a[m + 1 + y];
  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) a[k++] = L[i++];
    else a[k++] = R[j++];
  }
  while (i < n1) a[k++] = L[i++];
  while (j < n2) a[k++] = R[j++];
}`,
  cpp: `void mergeSort(vector<int>& a, int l, int r) {
  if (l < r) {
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
  }
}
void merge(vector<int>& a, int l, int m, int r) {
  vector<int> L(a.begin() + l, a.begin() + m + 1);
  vector<int> R(a.begin() + m + 1, a.begin() + r + 1);
  int i = 0, j = 0, k = l;
  while (i < (int)L.size() && j < (int)R.size()) {
    if (L[i] <= R[j]) a[k++] = L[i++];
    else a[k++] = R[j++];
  }
  while (i < (int)L.size()) a[k++] = L[i++];
  while (j < (int)R.size()) a[k++] = R[j++];
}`,
  python: `def merge_sort(a, l, r):
  if l < r:
    m = (l + r) // 2
    merge_sort(a, l, m)
    merge_sort(a, m + 1, r)
    merge(a, l, m, r)
  # done

def merge(a, l, m, r):
  L = a[l:m + 1]
  R = a[m + 1:r + 1]
  i = j = 0; k = l
  while i < len(L) and j < len(R):
    if L[i] <= R[j]:
      a[k] = L[i]; i += 1; k += 1
    else:
      a[k] = R[j]; j += 1; k += 1
  while i < len(L): a[k] = L[i]; i += 1; k += 1
  while j < len(R): a[k] = R[j]; j += 1; k += 1`,
};

const SNIPPETS: Record<string, Record<CodeLanguage, string>> = {
  bubble,
  insertion,
  selection,
  quick,
  merge,
};

export function getCode(algoId: string, lang: CodeLanguage): string {
  return SNIPPETS[algoId]?.[lang] ?? "";
}
