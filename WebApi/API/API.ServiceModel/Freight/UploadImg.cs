using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using ServiceStack;
using ServiceStack.Common.Web;
using ServiceStack.OrmLite;
using ServiceStack.ServiceHost;
using WebApi.ServiceModel.Tables;

namespace WebApi.ServiceModel.Freight
{
				[Route("/freight/upload/img", "Post")]
				[Route("/freight/upload/img", "Options")]
				public class UploadImg : IReturn<CommonResponse>
				{
								public Stream RequestStream { get; set; }
								public string FileName { get; set; }
								public string Name { get; set; }
				}
				public class UploadImg_Logic
				{
								public IDbConnectionFactory DbConnectionFactory { get; set; }
								public int upload(UploadImg request)
								{
												Image img = System.Drawing.Image.FromStream(request.RequestStream);
												img.Save(System.IO.Path.GetTempPath() + "\\myImage.Jpeg", ImageFormat.Jpeg);
												int i = 0;
												return i;
								}
				}
}
