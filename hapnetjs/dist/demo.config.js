
const config = {
    el: "element",
    nodes: [
        {
            id: "Node_0",
            radius: 12,
            x: null,
            y: null,
            meta: {
            },
            sectors: [
                {
                    number: 11,
                    category: "USA"
                },
                {
                    number: 11,
                    category: "UK"
                },
                {
                    number: 11,
                    category: "UK"
                },
            ]
        }

    ],
    links: [
        {
            source: "Node_0",
            target: "Node_1",
            marks: 0,
        }
    ],
    width: window.innerWidth,
    height: window.innerHeight,
    debug: false,
    backgroundColor: '#FFAACA',
    palette: [{ category: "UK", color: '#FFAACA' }], //palette: "default",
    zoom: 1,
    tooTip: {
        show: true,
        formatter: function ({ meta }) {

            return null
        },
    },
    coarseGraph: {
        LayoutIteration: 1000,
        HubThresholdLinks: null,
        MaxMaxStep: 50, // 最大的迭代步数
        HubNodePadding: 10,
    },
    LayoutSimulationIterations: 100,
    style: {
        linkWidth: 4,
        linkColor: "#000000",
        NodeOutline: {
            show: true,
            lineWidth: 1,
            lineColor: "#000000"
        }
    }



}
