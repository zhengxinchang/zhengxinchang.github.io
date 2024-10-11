import json
import sys

"""

meta:{
  item1:{
    data:[
        {} || ""
    ]
    process:function(){}
  }

}

"""

with open(sys.argv[1]) as fj:
    dat = json.load(fj)

    minidat = {
        "nodes": [],
        "edges": []
    }

    for item in dat['nodes']:

        tmpvalue = []
        for d in item["pieChart"]:
            tmpvalue.append(
                {
                    "number": d["percent"],
                    "category": d["color"]
                }
            )
            # map(d=>{ return d.percent})

        tmpnode = {
            "id": item["id"],
            "name": 'name_' + item["id"],
            "radius": item["radius"],
            "values": tmpvalue,
            "meta": {
                "panel":{
                    "SNPs":item['SNPs'],
                    "Virus":item['Virus'],
                    "degree":{
                        "total_degree":item.get('total_degree',"Empty"),
                        "in_degree":item.get('in_degree',"Empty"),
                        "out_degree":item.get('out_degree',"Empty") ,
                    }
                },
                "hover":{
                    "date": item.get('date',"Empty"),
                    "group":item.get('group',"Empty"),
                    "jump":item.get('jump',"Empty"),

                    "entropy":item.get('entropy',"Empty") ,
                }
            }
        }
        minidat['nodes'].append(tmpnode)

    for item in dat['links']:
        # tmpvalue = []
        # for d in item["pieChart"]:
        #     tmpvalue.append(d["percent"])
        #     # map(d=>{ return d.percent})
        tmpedge = {
            "source": item["source"],
            "target":   item["target"],
            "distance": item["distance"],
            "meta":{
                "panel":{
                    "minTime": item["minTime"]
                },
                "hover":{
                    "subset": item["subset"]
                }
            }
            
            
        }
        minidat['edges'].append(tmpedge)

    print(json.dumps(minidat,indent=4))
