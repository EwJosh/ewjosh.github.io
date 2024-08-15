import json
f = open('src\\assets\\data\\NikkeData.json')

data = json.load(f)
newList = []

for item in data:
    name = item.get('name')
    # print(type(item))
    newObj = {'id':name, 'data': item}
    # print(type(newObj))
    # if name == 'Yuni':
        # [print(newObj)]
    newList.append(newObj)
# print(newList)

with open('src\\assets\\data\\NewNikkeData.json', 'w') as g:
    json.dump(newList, g)

g.close()
f.close()