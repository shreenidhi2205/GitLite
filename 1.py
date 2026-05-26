def dfs (graph,node,visited):
    if node not in visited:
        print(node,end=" ")
        visited.add(node)

        for x in graph[node]:
            dfs(graph,x,visited)

visited=set()

graph={
    'A' :['B','C'],
    'B' :['A','D'],
    'C' :['A','D'],
    'D' :['B','C']
}

dfs(graph,'A',visited)