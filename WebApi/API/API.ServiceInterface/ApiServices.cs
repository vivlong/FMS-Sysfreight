using System;
using System.IO;
using System.Web;
using System.Net;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using ServiceStack;
using ServiceStack.Common.Web;
using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface;
using WebApi.ServiceModel;
using WebApi.ServiceModel.Utils;
using WebApi.ServiceModel.Freight;
using File = System.IO.File;
using System.Reflection;

namespace WebApi.ServiceInterface
{
    public class ApiServices : Service
    {        
        public Auth auth { get; set; }
								#region Freight
								public ServiceModel.Freight.Freight_Login_Logic freight_Login_Logic { get; set; }
        public object Any(ServiceModel.Freight.Freight_Login request)
        {
            CommonResponse ecr = new CommonResponse();
            ecr.initial();
            try
            {
                ServiceInterface.Freight.LoginService ls = new ServiceInterface.Freight.LoginService();
                ls.initial(auth, request, freight_Login_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
            }
            catch (Exception ex) { cr(ecr, ex); }
            return ecr;
								}
								public ServiceModel.Freight.Saus_Logic saus_Logic { get; set; }
								public object Any(ServiceModel.Freight.Saus request)
								{
												CommonResponse ecr = new CommonResponse();
												ecr.initial();
												try
												{
																ServiceInterface.Freight.TableService ls = new ServiceInterface.Freight.TableService();
																ls.TS_Saus(auth, request, saus_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
												}
												catch (Exception ex) { cr(ecr, ex); }
												return ecr;
								}
								public ServiceModel.Freight.Smct_Logic smct_Logic { get; set; }
								public object Any(ServiceModel.Freight.Smct request)
								{
												CommonResponse ecr = new CommonResponse();
												ecr.initial();
												try
												{
																ServiceInterface.Freight.TableService ts = new ServiceInterface.Freight.TableService();
																ts.TS_Smct(auth, request, smct_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
												}
												catch (Exception ex) { cr(ecr, ex); }
												return ecr;
								}
								public ServiceModel.Freight.Smsa_Logic smsa_Logic { get; set; }
								public object Any(ServiceModel.Freight.Smsa request)
								{
												CommonResponse ecr = new CommonResponse();
												ecr.initial();
												try
												{
																ServiceInterface.Freight.TableService ts = new ServiceInterface.Freight.TableService();
																ts.TS_Smsa(auth, request, smsa_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
												}
												catch (Exception ex) { cr(ecr, ex); }
												return ecr;
								}
								public ServiceModel.Freight.Plvi_Logic plvi_Logic { get; set; }
								public object Any(ServiceModel.Freight.Plvi request)
								{
												CommonResponse ecr = new CommonResponse();
												ecr.initial();
												try
												{
																ServiceInterface.Freight.TableService ts = new ServiceInterface.Freight.TableService();
																ts.TS_Plvi(auth, request, plvi_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
												}
												catch (Exception ex) { cr(ecr, ex); }
												return ecr;
								}
        public ServiceModel.Freight.Rcbp_Logic rcbp_Logic { get; set; }
        public object Any(ServiceModel.Freight.Rcbp request)
        {
            CommonResponse ecr = new CommonResponse();
            ecr.initial();
            try
            {
                ServiceInterface.Freight.TableService ls = new ServiceInterface.Freight.TableService();
                ls.TS_Rcbp(auth, request, rcbp_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
            }
            catch (Exception ex) { cr(ecr, ex); }
            return ecr;
        }
        public ServiceModel.Freight.Rcvy_Logic list_Rcvy1_Logic { get; set; }
        public object Get(ServiceModel.Freight.Rcvy request)
        {
            CommonResponse ecr = new CommonResponse();
            ecr.initial();
            try
            {
                ServiceInterface.Freight.TableService ls = new ServiceInterface.Freight.TableService();
                ls.TS_Rcvy(auth, request, list_Rcvy1_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
            }
            catch (Exception ex) { cr(ecr, ex); }
            return ecr;
        }
        public ServiceModel.Freight.Tracking_Logic list_Tracking_Logic { get; set; }
        public object Get(ServiceModel.Freight.Tracking request)
        {
            CommonResponse ecr = new CommonResponse();
            ecr.initial();
            try
            {
                ServiceInterface.Freight.TableService ls = new ServiceInterface.Freight.TableService();
                ls.TS_Tracking(auth, request, list_Tracking_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
            }
            catch (Exception ex) { cr(ecr, ex); }
            return ecr;
        }
								public ServiceModel.Freight.ViewPDF_Logic viewPDF_Logic { get; set; }
								public object Get(ServiceModel.Freight.ViewPDF request)
								{
												if (this.Request.RawUrl.IndexOf("/pdf/file") > 0)
												{
																byte[] heByte = viewPDF_Logic.Get_File(request);																
																return new HttpResult(heByte, "application/pdf");
												}
												else //this.Request.RawUrl.IndexOf("/pdf") > 0
												{
																CommonResponse ecr = new CommonResponse();
																ecr.initial();
																try
																{
																				ServiceInterface.Freight.PdfService ps = new ServiceInterface.Freight.PdfService();
																				ps.PS_View(auth, request, viewPDF_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
																}
																catch (Exception ex) { cr(ecr, ex); }
																return ecr;
												}
								}
								public ServiceModel.Freight.UploadImg_Logic uploadImg_Logic { get; set; }
								public object Any(ServiceModel.Freight.UploadImg request)
								{
												CommonResponse ecr = new CommonResponse();
												ecr.initial();
												try
												{
																ServiceInterface.Freight.PdfService ps = new ServiceInterface.Freight.PdfService();
																if (this.Request.Files.Length > 0)
																{
																				request.RequestStream = this.Request.Files[0].InputStream;
																				request.FileName = this.Request.Files[0].FileName;
																}																
																ps.PS_Upload(auth, request, uploadImg_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
												}
												catch (Exception ex) { cr(ecr, ex); }
												return ecr;
								}
								public ServiceModel.Freight.Jmjm_Logic jmjm_Logic { get; set; }
								public object Any(ServiceModel.Freight.Jmjm request)
								{
												CommonResponse ecr = new CommonResponse();
												ecr.initial();
												try
												{
																ServiceInterface.Freight.TableService ts = new ServiceInterface.Freight.TableService();
																ts.TS_Jmjm(auth, request, jmjm_Logic, ecr, this.Request.Headers.GetValues("Signature"), this.Request.RawUrl);
												}
												catch (Exception ex) { cr(ecr, ex); }
												return ecr;
								}
								#endregion
								public ServiceModel.Utils.QiniuToken_Logic qiniuToken_Logic { get; set; }
								public object Any(ServiceModel.Utils.QiniuToken request)
								{
												QiniuTokenResponse qtr = new QiniuTokenResponse();
												try
												{
																ServiceInterface.Utils.Qiniu q = new ServiceInterface.Utils.Qiniu();
																qtr.uptoken = q.Q_UpToken(request, qiniuToken_Logic);
												}
												catch (Exception ex) { qtr.uptoken = ex.Message; }
												return qtr;
								}
								private CommonResponse cr(CommonResponse ecr, Exception ex)
        {
            ecr.meta.code = 599;
            ecr.meta.message = "The server handle exceptions, the operation fails.";
            ecr.meta.errors.code = ex.GetHashCode();
            ecr.meta.errors.field = ex.HelpLink;
            ecr.meta.errors.message = ex.Message.ToString();
            return ecr;
        }
    }
}
