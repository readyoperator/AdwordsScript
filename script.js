/* 
Author: Matt Schutz
Last_Updated: 2-4-2014
Title: Report_To_PDF
Version: 0.3

Notes:

     - Need to grab client's email and business name somehow.
     
*/

  function main() {
  
  // grab SEARCH_QUERY_PERFORMANCE_REPORT from last month
   var queryReport = AdWordsApp.report("SELECT Device, Query, Clicks, Impressions, Ctr, AverageCpc, Cost " +
       "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +
       "DURING LAST_MONTH");

   var email = 'Your EMail Address';
   var company = 'Your Company Name';
   var queryRows = queryReport.rows();
   var tableData = [];
   var exTableData = [];
   var totalClicks = 0,
       totalImpressions = 0,
       totalCtr = 0,
       totalAverageCpc = 0,
       totalCost = 0;
    
   // prepare LAST month.  Run in February, returns January
   var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
   var d = new Date();
   var currentMonth = monthNames[d.getMonth() - 1]
    
    
   // fetch the LOGO image and base64-encode it.
   var logoURL = "YOUR LOGO URL HERE";
   var imageLogoBlob = UrlFetchApp.fetch(logoURL).getBlob();
   var logoBase64 = Utilities.base64Encode(imageLogoBlob.getBytes());
    
   // fetch another image and base64-encode it.
   var imageURL = "ANOTHER NICE IMAGE URL HERE";
   var imageOtherBlob = UrlFetchApp.fetch(imageURL).getBlob();
   var imageBase64 = Utilities.base64Encode(imageOtherBlob.getBytes());
   
   
   // take SEARCH_QUERY_PERFORMANCE_REPORT data, add totals and put it into html table
   while (queryRows.hasNext()) {
     var row = queryRows.next();
     var device = row['Device'];
     var query = row['Query'];
     var clicks = row['Clicks'];
     var impressions = row['Impressions'];
     var ctr = row['Ctr'];
     var averageCpc = row['AverageCpc'];
     var cost = row['Cost'];
     
     tableData.push("<tr><td style='color:#0e456e;'>" + device + "</td>" +
                    "<td>" + query + "</td>" +
                    "<td style='background-color:#95c1e6;'>" + clicks + "</td>" +
                    "<td>" + impressions + "</td>" +
                    "<td style='background-color:#95c1e6;'>" + ctr + "</td>" +
                    "<td>$" + averageCpc + "</td>" +
                    "<td style='background-color:#95c1e6;'>$" + cost + "</td></tr>");
     
     // add up totals
     totalClicks += parseInt(clicks);
     totalImpressions += parseInt(impressions);
     totalCtr += parseFloat(ctr);
     totalAverageCpc += parseFloat(averageCpc);
     totalCost += parseFloat(cost);
     
   }// end of while
    
               
   // average total of ctr and averageCpc for search_query_report
   var avgTotalCtr = ((totalClicks/totalImpressions)*100).toFixed(2) + "%";
   var avgTotalAverageCpc = (totalAverageCpc/tableData.length).toFixed(2);
    
   // join the giant data table together into string
   var bigTable = tableData.join("");
    
    
   
   // grab PLACEHOLDER_FEED_ITEM_REPORT from last month
   var extensionReport = AdWordsApp.report("SELECT AttributeValues, Clicks, Impressions, Ctr, AverageCpc, Cost, ClickType " +
       "FROM PLACEHOLDER_FEED_ITEM_REPORT " +
       "DURING LAST_MONTH");
    
   var extensionRows = extensionReport.rows();
   var exTableData = [];
   var exTotalClicks = 0,
       exTotalImpressions = 0,
       exTotalCtr = 0,
       exTotalAverageCpc = 0,
       exTotalCost = 0;
    

   // take PLACEHOLDER_FEED_ITEM_REPORT data, add totals and put it into html table
   while (extensionRows.hasNext()) {
     
     var row = extensionRows.next();
     
     if(row['ClickType']=== 'Phone calls'){
       var attVal = row['AttributeValues'];
       var clicks = row['Clicks'];
       var impressions = row['Impressions'];
       var ctr = row['Ctr'];
       var averageCpc = row['AverageCpc'];
       var cost = row['Cost'];
       
       exTableData.push("<tr><td style='color:#0e456e'>" + attVal + "</td>" +
                        "<td style='background-color:#95c1e6;'>" + clicks + "</td>" +
                        "<td>" + impressions + "</td>" +
                        "<td style='background-color:#95c1e6;'>" + ctr + "</td>" +
                        "<td>$" + averageCpc + "</td>" +
                        "<td style='background-color:#95c1e6;'>$" + cost + "</td>" +
                        "<td></td>" + "</tr>");
       
       // add up totals
       exTotalClicks += parseInt(clicks);
       exTotalImpressions += parseInt(impressions);
       exTotalCtr += parseFloat(ctr);
       exTotalAverageCpc += parseFloat(averageCpc);
       exTotalCost += parseFloat(cost);
     } // end if
   }// end while 
    
   // average total of ctr and averageCpc for PLACEHOLDER_FEED_ITEM_REPORT
   var avgExTotalCtr = ((exTotalClicks/exTotalImpressions)*100).toFixed(2) + "%";
   var avgExTotalAverageCpc = (exTotalAverageCpc/exTableData.length).toFixed(2);
    
   // join the PLACEHOLDER_FEED_ITEM_REPORT data table together into string
   var exBigTable = exTableData.join("");
    
    
    
   // designing putting this all together in one big html 
   var html = "<body style='width:900px; margin: 0 auto; font-family: Verdana;'>" + 
                "<div align='center'>" +
                  "<img style='align:left;' src='data:image/jpg;base64," + logoBase64 + "'/>" +
                  "<img style='width:125px' src='data:image/jpg;base64," + imageBase64 + "'/>" + 
                "</div><br>" +
                "<div style='text-align: center; color: #0e456e'>" + 
                  "<p style='font-size:28px;'>Google Adwords Pay Per Click Monthly Report</p>" +
                  "<p>Status Update for: <b>" + company + "</b></p>" +
                  "<p>Overall status: <span style='color:green;'>Green</span></p>" +
                "</div>" +
                "<p style='text-align: center;'>Overview: This is an updated report for " + currentMonth +
                ", 2014 from Google AdWords. This analytical report for the month of " +
                currentMonth + ", 2014 summarizes all keywords that were clicked including, CPC, Total CPC, CTR, and Page Position.</p>" +
                "<table cellpadding='5' >" + 
                  "<tr style='color:#0e456e'>" + 
                    "<td>Device</td>" + 
                    "<td>Search Term</td>" + 
                    "<td>Clicks</td>" + 
                    "<td>Impressions</td>" + 
                    "<td>CTR (%)</td>" + 
                    "<td>Avg. CPC</td>" + 
                    "<td>Cost</td>" + 
                  "</tr>" + 
                  bigTable + 
                  "<tr>" + 
                    "<td><b>Total</b></td>" + 
                    "<td>--</td>" + 
                    "<td>"+totalClicks+"</td>" + 
                    "<td>"+totalImpressions+"</td>" + 
                    "<td>"+avgTotalCtr+"</td>" + 
                    "<td>$"+avgTotalAverageCpc+"</td>" + 
                    "<td>$"+totalCost.toFixed(2)+"</td>" + 
                  "</tr>" + 
                  "<tr>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                  "</tr>" +
                  "<tr>" + 
                    "<td><b>Call Extension Report</b></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                    "<td></td>" + 
                  "</tr>" +
                  "<tr style='color:#0e456e'>" + 
                    "<td>Attribute Values</td>" + 
                    "<td>Clicks</td>" + 
                    "<td>Impressions</td>" + 
                    "<td>CTR (%)</td>" + 
                    "<td>Avg. CPC</td>" + 
                    "<td>Cost</td>" + 
                    "<td></td>" + 
                  "</tr>" +                   
                  exBigTable + 
                  "<tr>" + 
                    "<td><b>Total</b></td>" + 
                    "<td>" + exTotalClicks+"</td>" + 
                    "<td>" + exTotalImpressions + "</td>" + 
                    "<td>" + avgExTotalCtr + "</td>" + 
                    "<td>$" + avgExTotalAverageCpc + "</td>" + 
                    "<td>$" + exTotalCost.toFixed(2) + "</td>" + 
                    "<td></td>" + 
                  "</tr>" +
                "</table>" + 
                "<p>Your current campaign is in <span style='color:green;'>GOOD</span> condition.</p>" + 
              "</body>" + 
            "</html>";
              
    
    
   // create a blob with the html, convert it to PDF.
   var htmlBlob = Utilities.newBlob(html, MimeType.HTML);
   var pdfBlob = htmlBlob.getAs(MimeType.PDF);
    
   // name the pdf
   pdfBlob.setName(company + " Report.pdf");
    
   // mail: TO, SUBJECT, BODY, ATTACHMENTS
   MailApp.sendEmail(
     email,
     company + " Adwords Report",
     "Monthly Adwords report is now ready.  Please, download attached file. ",
     {attachments: [pdfBlob]}
   );

}

