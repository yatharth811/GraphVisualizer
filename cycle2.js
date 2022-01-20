let n, m;
let adj = Array.from(Array(100)).map((i) =>
    Array.from(Array(100)).map((i) => 0)
  ),
  valuation = Array.from(Array(100)).map((i) =>
    Array.from(Array(100)).map((i) => 0)
  ),
  allocation = [];
let color, parent;
let cycle_start, cycle_end;
let states = [];

n = 3;
m = 6;
console.log(n,m);
valuation = [
  [2, 1, 3, 0, 1, 2],
  [10, 1, 1, 1, 2, 5],
  [3, 1, 3, 0, 5, 2],
];

function dfs(v) {
  color[v] = 1;
  for (let u = 0; u < n; u++) {
    if (adj[v][u] == 1) {
      if (color[u] == 0) {
        parent[u] = v;
        if (dfs(u)) return true;
      } else if (color[u] == 1) {
        cycle_end = v;
        cycle_start = u;
        return true;
      }
    }
  }
  color[v] = 2;
  return false;
}

function find_cycle() {
  color = Array.from(Array(n)).map((i) => 0);
  parent = Array.from(Array(n)).map((i) => -1);
  cycle_start = -1;

  for (let v = 0; v < n; v++) {
    if (color[v] == 0 && dfs(v)) break;
  }

  if (cycle_start == -1) {
    // process.stdout.write("Acyclic\n");
  } else {
    let cycle = [];
    cycle.push(cycle_start);
    for (let v = cycle_end; v != cycle_start; v = parent[v]) cycle.push(v);
    cycle.push(cycle_start);
    cycle.reverse();

    // process.stdout.write("Cycle found:\n");
    for (let x of cycle) {
      // process.stdout.write(`${x + 1} `);
    }
    for (let i = 1; i < cycle.length - 1; i++) {
      [allocation[cycle[i]], allocation[cycle[i - 1]]] = [
        allocation[cycle[i - 1]],
        allocation[cycle[i]],
      ];
    }

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let x of allocation[i]) {
        sum += valuation[i][x];
      }
      for (let j = 0; j < n; j++) {
        let res = 0;
        for (let x of allocation[j]) {
          res += valuation[i][x];
        }
        if (sum < res) {
          adj[i][j] = 1;
        } else {
          adj[i][j] = 0;
        }
      }
    }
    states.push({allocation: allocation.map(arr => arr.slice()), adj: adj.map(arr => arr.slice())});
    // process.stdout.write("\n");
  }
}

function find_source() {
  let indegree = Array.from(Array(n)).map((i) => 0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (adj[i][j] == 1) indegree[j] += 1;
    }
  }
  let er = -1;
  for (let i = 0; i < n; i++) {
    if (indegree[i] == 0) {
      er = i;
      break;
    }
  }
  return er;
}

function generateStates() {
  console.log("n:", n, "m:", m);
  console.log(typeof n);

  allocation = Array.from(Array(n)).map((i) => []);
  values = Array.from(Array(n)).map((i) => 0);

  console.log(allocation);

  for (let i = 0; i < m; i++) {
    let src = find_source();
    while (src == -1) {
      find_cycle();
      src = find_source();
    }
    allocation[src].push(i);

    console.log("allocation:", allocation);
    console.log("src:", src);

    let sum = 0;
    for (let x of allocation[src]) {
      sum += valuation[src][x];
    }

    for (let j = 0; j < n; j++) {
      let res = 0,
        ser = 0,
        resser = 0;
      for (let x of allocation[j]) {
        res += valuation[src][x];
        ser += valuation[j][x];
      }
      for (let x of allocation[src]) {
        resser += valuation[j][x];
      }
      if (sum < res) {
        adj[src][j] = 1;
      } else {
        adj[src][j] = 0;
      }
      if (ser < resser) {
        adj[j][src] = 1;
      } else {
        adj[j][src] = 0;
      }
    }

    states.push({allocation: allocation.map(arr => arr.slice()), adj: adj.map(arr => arr.slice())});

  }
  for (let i = 0; i < allocation.length; i++) {
    // process.stdout.write(`a_{${i + 1}} -> `);
    for (let y of allocation[i]) {
      // process.stdout.write(`g_{${y + 1}} `);
    }
    // process.stdout.write("\n");
  }

}

function toEdges(state){
  let edges = [];
  let x = state.allocation, y = state.adj;
  for (let i=0; i<y.length; i++){
    for (let j=0; j<y.length; j++){
      if (y[i][j] == 1){
        edges.push({from: i+1, to: j+1});
      }
    }
  }
  return edges;
}


// generateStates();
// console.log(states);
// console.log(toEdges(states[4]));
