package app.v1ce.widget
import android.content.Context
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.glance.GlanceModifier
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.Text
import androidx.glance.unit.ColorProvider
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.first
import org.json.JSONObject
private val Context.v1ceWidgetStore by preferencesDataStore(name="v1ce_widget")
class V1CEWidget:GlanceAppWidget(){
 override suspend fun provideGlance(context:Context,id:androidx.glance.GlanceId){
  val raw=context.v1ceWidgetStore.data.first()[stringPreferencesKey("snapshot")]
  provideContent{
   val d=raw?.let{JSONObject(it)};val date=d?.optString("sobrietyDate","")?:"";val name=d?.optString("displayName","")?:"";val c=d?.optString("coinColor","#F5D680")?:"#F5D680"
   val days=runCatching{java.time.temporal.ChronoUnit.DAYS.between(java.time.LocalDate.parse(date.take(10)),java.time.LocalDate.now()).coerceAtLeast(0).toInt()}.getOrDefault(0);val y=days/365;val m=(days%365)/30;val v=if(y>0)y else if(m>0)m else days;val label=if(y>0)if(y==1)"YEAR" else "YEARS" else if(m>0)if(m==1)"MONTH" else "MONTHS" else "DAYS";val bg=runCatching{Color(android.graphics.Color.parseColor(c))}.getOrDefault(Color(0xFFF5D680))
   Column(GlanceModifier.fillMaxSize().background(ColorProvider(bg)).padding(12.dp).clickable(actionStartActivity<app.v1ce.MainActivity>()),verticalAlignment=Alignment.CenterVertically,horizontalAlignment=Alignment.CenterHorizontally){Text(v.toString());Text(label);if(name.isNotBlank())Text(name.uppercase())}
  }
 }
}