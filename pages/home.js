import React, { use, useEffect } from "react";
import { useState } from "react";
import EChartsNextForReactCore from "echarts-next-for-react";
import * as echarts from "echarts/core";
import { HeatmapChart } from "echarts/charts";
import { BarChart } from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  ToolboxComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import Layout from "../layout";
echarts.use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  BarChart,
]);

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { thousandFormater } from "../utils/thousandformater";
import { dataDefautlGraph } from "@/data/dataDashboardBase";
import GoogleMaps from "@/components/heatMap";
import { dataMotos } from "@/data/newDataMotos";


export const home = () => {
  const [dataDashboard, setDataDashboard] = useState(dataDefautlGraph);
  const [dataMotosC, setDataMotosC] = useState(dataMotos);
  const [filters, setFilters] = useState({
    "departamento": null,
    "vehicle": null,
    "date_start": null,
    "date_end": null
  });



  const handleFilters = (e, type) => {
    setFilters({
      ...filters,
      [type]: e.target.value,
    });

    refetchDataDashboard();
  };

  const captureDivAsImage = () => {
    const div = document.getElementById("your-div-id"); // Replace with your div's ID
    html2canvas(div)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        createPDF(imgData);
      })
      .catch((error) => {
        console.error("Error capturing div as image:", error);
      });
  };

  const createPDF = (imgData) => {
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("dashboardData.pdf"); // Replace with your desired file name
  };

  const [timerDaysArray, setTimerDaysArray] = useState([]);
  const [timerHoursArray, setTimerHoursArray] = useState([]);
  const [timerMinutesArray, setTimerMinutesArray] = useState([]);
  useEffect(() => {
    if (dataDashboard) {
      let time = dataDashboard.dataAdmin.tiempo;
      let timeArray = time.split(":");
      let timeDays = timeArray[0];
      timeDays = timeDays.split("");
      //set
      setTimerDaysArray(timeDays);
      let timeHours = timeArray[1];
      timeHours = timeHours.split("");
      //set
      setTimerHoursArray(timeHours);
      let timeMinutes = timeArray[2];
      timeMinutes = timeMinutes.split("");
      //set
      setTimerMinutesArray(timeMinutes);
    }
  }, [dataDashboard]);

  const [marcasYModelos, setMarcasYModelos] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalKms: 0,
    totalArboles: 0,
    totalTelefonos: 0,
    totalBolsas: 0,
    totalCO2: 0,
  });


  const [graphPastel, setGraphPastel] = useState({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Furgonetas eléctricas' },
          { value: 735, name: 'Vehículos eléctricos' },
          { value: 580, name: 'Vehiculos hibridos' },
          { value: 484, name: 'Motos eléctricas (Cargobikes)' },
          { value: 300, name: 'Bicicletas eléctricas' }
        ]
      }
    ]
  });

  const [graphCO2, setGraphCO2] = useState({
    "tooltip": {
      "trigger": "axis",
      "axisPointer": {
        "type": "shadow"
      }
    },
    "grid": {
      "left": "3%",
      "right": "4%",
      "bottom": "3%",
      "containLabel": true
    },
    "xAxis": [
      {
        "type": "category",
        "data":[],
        "axisTick": {
          "alignWithLabel": true
        }
      }
    ],
    "yAxis": [
      {
        "type": "value"
      }
    ],
    "series": [
      {
        "name": "Viajes",
        "type": "bar",
        "barWidth": "60%",
        "data": [],
        "itemStyle": {
          "color": "#06e0c9"
        },
        "label": {
          "show": true,
          "position": "top"
        }
      }
    ]
  });


  useEffect(() => {
    setDataMotosC(dataMotos);
    let arr = [];
    dataMotos.map((item) => {
      if (!arr.includes(item.Marca_y_modelo)) {
        arr.push(item.Marca_y_modelo);
      }
    });
    let arrDataPastel = arr.map((item) => {
      return {
        value: 0,
        name: item
      }
    });

    let arrDataBar = arr.map((item) => {
      return {
        value: 0,
        name: item
      }
    });

    dataMotos.map((item) => {
      arrDataPastel.map((item2) => {
        if (item.Marca_y_modelo === item2.name) {
          item2.value += parseFloat(item.Km);
        }
      });

      arrDataBar.map((item2) => {
        if (item.Marca_y_modelo === item2.name) {
          item2.value += parseFloat(item.CO2);
        }
      });
    }
    );
    let totalKms = 0;
    let totalArboles = 0;
    let totalTelefonos = 0;
    let totalBolsas = 0;
    let totalCO2 = 0;
    dataMotos.map((item) => {
      if ((filters.vehicle === item.Marca_y_modelo || filters.vehicle === null)) {
        totalKms += parseFloat(item.Km);
        totalArboles += parseFloat(item.ARBOLES);
        totalTelefonos += parseFloat(item.TELEFONOS);
        totalBolsas += parseFloat(item.BOLSAS);
        totalCO2 += parseFloat(item.CO2);
      }
    });
    setAnalytics({
      totalKms,
      totalArboles,
      totalTelefonos,
      totalBolsas,
      totalCO2,
    });
    setMarcasYModelos(arr);

    //setGraphPastel
    setGraphPastel({
      ...graphPastel,
      series: [
        {
          ...graphPastel.series[0],
          data: arrDataPastel,
        }
      ]
    });

    //setGraphCO2
    setGraphCO2({
      ...graphCO2,
      xAxis: [
        {
          ...graphCO2.xAxis[0],
          data: arr,
        }
      ],
      series: [
        {
          ...graphCO2.series[0],
          data: arrDataBar.map((item) => item.value),
        }
      ]
    });

  }, [dataMotos, filters]);

  return (
    <Layout>
      <div
        className="flex flex-col w-full h-auto bg-white p-5 box-border rounded-[12px] gap-8 relative"
        id="your-div-id"
      >
        <button onClick={captureDivAsImage} className="buttonExport">
          Exportar
        </button>
        <div className="w-full h-auto flex flex-col gap-2 justify-center items-center">
          <div className="w-full h-auto flex justify-center items-center">
            <select className="selectPicker" onChange={(e) => handleFilters(e, "vehicle")} value={filters.vehicle}>
              <option value="0" disabled selected>
                Escoge un modelo
              </option>
              {marcasYModelos.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full h-auto flex flex-col items-start gap-4 customSecBg">
          <div className="w-auto h-auto">
            <p className="text-[25px] font-bold text-[#FFFFFF]">
              Kilometros Totales
            </p>
          </div>
          <div className="w-full h-auto">
            <div className="w-full h-auto">
              <div className="card flex  justify-center items-center gap-4">
                <div>
                  <p className="font-bold text-[#595959]">
                    KM
                  </p>
                  <div className="flex w-auto min-w-[200px] h-auto px-1 justify-center items-center box-border border-2 border-[#C6C6C6] rounded-[10px]">
                    <p className="font-bold text-[30px] text-[#C6C6C6] m-0">
                      {thousandFormater(analytics.totalKms)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="item w-auto h-auto">
          <div className="card">
            <h2 className="font-bold text-[#595959] text-[20px]">
              Vehiculos
            </h2>
            <EChartsNextForReactCore
              option={graphPastel}
              style={{ height: "400px", width: "100%" }}
            />
          </div>
        </div>
        {/*End Sections*/}
        {/*Start Sections*/}
        {/*Section 1*/}
        <div className="w-full h-auto flex flex-col items-start gap-4 customSecBg">
          <div className="w-auto h-auto">
            <p className="text-[25px] font-bold text-[#FFFFFF]">
              Reducción de huella de carbono
            </p>
          </div>
          <div className="w-full h-auto">
            <div className="item w-auto h-auto">
              <div className="card">
                <h2 className="font-bold text-[#595959] text-[20px]">
                  Co2 dejado de emitir
                </h2>
                <EChartsNextForReactCore
                  option={graphCO2}
                  style={{ height: "400px", width: "100%" }}
                />
              </div>
            </div>
            <div className="item w-auto h-auto !flex flex-wrap gap-2.5">
              <div className="!w-[49%] card flex flex-col justify-center items-center gap-4">
                <p className="font-bold text-[#595959]">SMARTPHONE CARGADOS</p>
                <div className="flex flex-col justify-center items-center gap-2">
                  <img
                    src="img/celularesCargados.png"
                    alt="Apple"
                    className="w-[30px] h-[40px]"
                  />
                  <p className="font-bold text-[30px] text-[#C6C6C6]">
                    {thousandFormater(analytics.totalTelefonos)}
                  </p>
                </div>
              </div>
              <div className="!w-[49%] card flex flex-col justify-center items-center gap-4">
                <p className="font-bold text-[#595959]">ARBOLES PLANTADOS</p>
                <div className="flex flex-col justify-center items-center gap-2.5">
                  <img
                    src="img/plantulasSembradas.png"
                    alt="Apple"
                    className="w-[40px] h-[40px]"
                  />
                  <p className="font-bold text-[30px] text-[#C6C6C6]">
                    {thousandFormater(analytics.totalArboles)}

                  </p>
                </div>
              </div>
              <div className="!w-[49%] card flex flex-col justify-center items-center gap-4">
                <p className="font-bold text-[#595959]">
                  BOLSAS DE BASURA RECICLADAS
                </p>
                <div className="flex flex-col justify-center items-center gap-2.5">
                  <img
                    src="img/bolsasDeBasura.png"
                    alt="Apple"
                    className="w-[40px] h-[40px]"
                  />
                  <p className="font-bold text-[30px] text-[#C6C6C6]">
                    {thousandFormater(analytics.totalBolsas)}
                  </p>
                </div>
              </div>
              <div className="!w-[49%] card flex flex-col justify-center items-center gap-4">
                <p className="font-bold text-[#595959]">
                  Co2 Total Dejado De Emitir
                </p>
                <div className="flex flex-col justify-center items-center gap-2.5">
                  <img
                    src="img/carbon-dioxide.svg"
                    alt="Apple"
                    className="w-[40px] h-[40px]"
                  />
                  <p className="font-bold text-[30px] text-[#C6C6C6]">
                    {thousandFormater(analytics.totalCO2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default home;
