import React, { useEffect } from "react";
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


export const home = () => {
  const [dataDashboard, setDataDashboard] = useState(dataDefautlGraph);
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
            <input type="date" className="datePickerOne" onChange={(e) => handleFilters(e, "date_start")} value={filters.date_start} />
            <input type="date" className="datePickerTwo" onChange={(e) => handleFilters(e, "date_end")} value={filters.date_end} />
          </div>
          <div className="w-full h-auto flex justify-center items-center">
            <select className="selectPicker" onChange={(e) => handleFilters(e, "vehicle")} value={filters.vehicle}>
              <option value="0" disabled selected>
                Escoge un medio de transporte
              </option>
              <option value="Transporte público">Transporte público</option>
              <option value="Caminar">Caminar</option>
              <option value="Bicicleta">Bicicleta</option>
              <option value="Patinete eléctrico">Patinete eléctrico</option>
              <option value="Bicicleta eléctrica">Bicicleta eléctrica</option>
              <option value="Moto eléctrica">Moto eléctrica</option>
            </select>
          </div>
        </div>

        <div className="w-full h-auto flex flex-col items-start gap-4 customSecBg">
          <div className="w-auto h-auto">
            <p className="text-[25px] font-bold text-[#FFFFFF]">
              CAEs Estimados
            </p>
          </div>
          <div className="w-full h-auto">
            <div className="w-full h-auto">
              <div className="card flex  justify-center items-center gap-4">
                <div>
                  <p className="font-bold text-[#595959]">
                    MWh
                  </p>
                  <div className="flex w-auto min-w-[200px] h-auto px-1 justify-center items-center box-border border-2 border-[#C6C6C6] rounded-[10px]">
                    <p className="font-bold text-[30px] text-[#C6C6C6] m-0">
                      1000
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-[#595959]">
                    Ahorro MWh
                  </p>
                  <div className="flex w-auto min-w-[200px] h-auto px-1 justify-center items-center box-border border-2 border-[#C6C6C6] rounded-[10px]">
                    <p className="font-bold text-[30px] text-[#C6C6C6] m-0">
                      € 70,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                  option={dataDashboard?.co2off}
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
                    {thousandFormater(dataDashboard?.dataAdmin?.smartphones)}
                  </p>
                </div>
              </div>
              <div className="!w-[49%] card flex flex-col justify-center items-center gap-4">
                <p className="font-bold text-[#595959]">PLANTULAS SEMBRADAS</p>
                <div className="flex flex-col justify-center items-center gap-2.5">
                  <img
                    src="img/plantulasSembradas.png"
                    alt="Apple"
                    className="w-[40px] h-[40px]"
                  />
                  <p className="font-bold text-[30px] text-[#C6C6C6]">
                    {thousandFormater(
                      dataDashboard?.dataAdmin?.numeroPlantulas
                    )}
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
                    {thousandFormater(
                      dataDashboard?.dataAdmin?.bolsasRecicladas
                    )}
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
                    {thousandFormater(dataDashboard?.dataAdmin?.co2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Section 2*/}
        <div className="w-full h-auto flex flex-col items-start gap-4 customSecBg2">
          <div className="w-full h-auto customMasonry">
            <div className="item w-auto h-auto">
              <div className="card">
                <h2 className="font-bold text-[#595959] text-[20px]">Mapa de Calor Madrid</h2>
                <GoogleMaps />
              </div>
            </div>
            <div className="item w-auto h-auto">
              <div className="card">
                <h2 className="font-bold text-[#595959] text-[20px]">Viajes</h2>
                <EChartsNextForReactCore
                  option={dataDashboard?.viajes}
                  style={{ height: "400px", width: "100%" }}
                />
              </div>
            </div>
            <div className="item w-auto h-auto">
              <div className="card flex flex-col justify-center items-center gap-4">
                <p className="font-bold text-[#595959]">km recorridos</p>
                <div className="flex w-auto min-w-[200px] h-auto px-1 justify-center items-center box-border border-2 border-[#C6C6C6] rounded-[10px]">
                  <p className="font-bold text-[30px] text-[#C6C6C6] m-0">
                    {thousandFormater(dataDashboard?.dataAdmin?.km)}
                  </p>
                </div>
                <p className="font-bold text-[#595959]">
                  Viajes Totales Realizados
                </p>
                <div className="flex w-auto min-w-[200px] h-auto px-1 justify-center items-center box-border border-2 border-[#C6C6C6] rounded-[10px]">
                  <p className="font-bold text-[30px] text-[#C6C6C6] m-0">
                    {thousandFormater(dataDashboard?.dataAdmin?.viajes)}
                  </p>
                </div>
              </div>
            </div>
            <div className="item w-auto h-auto">
              <div className="card">
                <h2 className="font-bold text-[#595959] text-[20px]">
                  Medios de transporte
                </h2>
                <EChartsNextForReactCore
                  option={dataDashboard?.transporte}
                  style={{ height: "400px", width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default home;
