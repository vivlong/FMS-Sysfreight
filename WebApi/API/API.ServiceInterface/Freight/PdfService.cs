using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebApi.ServiceModel;
using WebApi.ServiceModel.Freight;

namespace WebApi.ServiceInterface.Freight
{
				public class PdfService
				{
								public void PS_View(Auth auth, ViewPDF request, ViewPDF_Logic logic, CommonResponse ecr, string[] token, string uri)
								{
												if (auth.AuthResult(token, uri))
												{
															 if (uri.IndexOf("/pdf") > 0)
																{
																				ecr.data.results = logic.Get_List(request);
																}
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
												}
												else
												{
																ecr.meta.code = 401;
																ecr.meta.message = "Unauthorized";
												}
								}
								public void PS_Upload(Auth auth, UploadImg request, UploadImg_Logic logic, CommonResponse ecr, string[] token, string uri)
								{
												if (auth.AuthResult(token, uri))
												{
																ecr.data.results = logic.upload(request);
																ecr.meta.code = 200;
																ecr.meta.message = "OK";
												}
												else
												{
																ecr.meta.code = 401;
																ecr.meta.message = "Unauthorized";
												}
								}
				}
}
