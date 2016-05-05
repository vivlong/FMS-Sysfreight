using System;
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
												public string Extension;
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
																				if (diA.Length > 0)
																				{
																								for (int i = 0; i <= diA.Length - 1; i++)
																								{
																												JobNoAttachName tnn = new JobNoAttachName();
																												tnn.Key = diA[i].Name;
																												FileInfo[] arrFi = diA[i].GetFiles();
																												if (arrFi.Length > 0)
																												{
																																SortAsFileCreationTime(ref arrFi);
																																tnn.FileName = arrFi[0].Name;
																																tnn.Extension = arrFi[0].Extension;
																												}
																												else
																												{
																																tnn.FileName = "";
																																tnn.Extension = "";
																												}
																												jan.Add(tnn);
																												GetAllDirList(diA[i].FullName);
																								}
																				}
																				else
																				{
																								JobNoAttachName tnn = new JobNoAttachName();
																								tnn.Key = di.Name;
																								FileInfo[] arrFi = di.GetFiles();
																								if (arrFi.Length > 0)
																								{
																												SortAsFileCreationTime(ref arrFi);
																												tnn.FileName = arrFi[0].Name;
																												tnn.Extension = arrFi[0].Extension;
																								}
																								else
																								{
																												tnn.FileName = "";
																												tnn.Extension = "";
																								}
																								jan.Add(tnn);
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
																strPath = DocumentPath + "\\Jmjm1\\" + request.JobNo;
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
																								string strSQL = "Select JobNo From Jmjm1 Where IsNull(AttachmentFlag,'')='Y' And JobNo in (" + strKeys + ")";
																								List<View_Attach> rJmjm = db.Select<View_Attach>(strSQL);
																								foreach (View_Attach vi in rJmjm)
																								{
																												for (int i = 0; i <= jan.Count - 1; i++)
																												{
																																if (jan[i].Key.Equals(vi.JobNo.ToString()))
																																{
																																				vi.FileName = jan[i].FileName;
																																				vi.Extension = jan[i].Extension;
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
