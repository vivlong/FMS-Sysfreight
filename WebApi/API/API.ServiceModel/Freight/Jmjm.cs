﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ServiceStack;
using ServiceStack.ServiceHost;
using ServiceStack.OrmLite;
using WebApi.ServiceModel.Tables;
using System.IO;

namespace WebApi.ServiceModel.Freight
{
				[Route("/freight/jmjm1/doc", "Get")]				// doc?JobNo=
				[Route("/freight/jmjm1/attach", "Get")]	// attach?JobNo=
    public class Jmjm : IReturn<CommonResponse>
    {
        public string JobNo { get; set; }
    }
				public class Jmjm_Logic
    {
        public IDbConnectionFactory DbConnectionFactory { get; set; }
								public struct JobNoAttachName
								{
												public string Key;
												public string FileName;
								}
								private List<JobNoAttachName> jan = null;
								private void SortAsFileCreationTime(ref FileInfo[] arrFi)
								{
												Array.Sort<FileInfo>(arrFi, delegate(FileInfo x, FileInfo y) { return y.CreationTime.CompareTo(x.CreationTime); });
								}
								public void GetAllDirList(string strPath)
								{
												try
												{
																if (Directory.Exists(strPath))
																{
																				DirectoryInfo di = new DirectoryInfo(strPath);
																				DirectoryInfo[] diA = di.GetDirectories();
																				for (int i = 0; i <= diA.Length - 1; i++)
																				{
																								JobNoAttachName tnn = new JobNoAttachName();
																								tnn.Key = diA[i].Name;
																								FileInfo[] arrFi = diA[i].GetFiles();
																								if (arrFi.Length > 0)
																								{
																												SortAsFileCreationTime(ref arrFi);
																												tnn.FileName = arrFi[0].Name;
																								}
																								else
																								{
																												tnn.FileName = "";
																								}
																								jan.Add(tnn);
																								GetAllDirList(diA[i].FullName);
																				}
																}
												}
												catch { throw; }
								}
								public object Get_Jmjm1_Attach_List(Jmjm request)
								{
												object Result = null;
												jan = new List<JobNoAttachName>();
												string strPath = "";
												string DocumentPath = "";
												try
												{
																using (var db = DbConnectionFactory.OpenDbConnection())
																{
																				string strSQL = "Select Top 1 DocumentPath From Saco1";
																				List<Saco1> saco1 = db.Select<Saco1>(strSQL);
																				if (saco1.Count > 0)
																				{
																								DocumentPath = saco1[0].DocumentPath;
																				}
																}
																strPath = DocumentPath + "\\Jmjm1";
																GetAllDirList(strPath);
																if (jan.Count > 0)
																{
																				string strKeys = "";
																				for (int i = 0; i <= jan.Count - 1; i++)
																				{
																								strKeys = strKeys + "'" + jan[i].Key + "',";
																				}
																				if (strKeys.LastIndexOf(",").Equals(strKeys.Length - 1))
																				{
																								strKeys = strKeys.Substring(0, strKeys.Length - 1);
																				}
																				using (var db = DbConnectionFactory.OpenDbConnection())
																				{
																								string strSQL = "Select JobNo,JobDate,CustomerName,InvoiceLocalAmt From Jmjm1 Where IsNull(AttachmentFlag,'')='Y' And JobNo in (" + strKeys + ")";
																								List<ViewPDF_Jmjm> rJmjm = db.Select<ViewPDF_Jmjm>(strSQL);
																								foreach (ViewPDF_Jmjm vi in rJmjm)
																								{
																												for (int i = 0; i <= jan.Count - 1; i++)
																												{
																																if (jan[i].Key.Equals(vi.JobNo.ToString()))
																																{
																																				vi.FileName = jan[i].FileName;
																																				break;
																																}
																												}
																								}
																								Result = rJmjm;
																				}
																}
												}
												catch { throw; }
												return Result;
								}
								public List<Jmjm1_Doc> Get_Jmjm1_Doc_List(Jmjm request)
        {
												List<Jmjm1_Doc> Result = null;
            try
            {
																using (var db = DbConnectionFactory.OpenDbConnection())
                {
																				string strSQL = "SELECT Top 1 JobNo " +
																								"FROM Jmjm1 Where JobNo='" + request.JobNo + "' And IsNull(StatusCode,'')<>'DEL'";
																				Result = db.Select<Jmjm1_Doc>(strSQL);
                }
            }
            catch { throw; }
            return Result;
        }
    }
}
