(function () {
  const ctx = Layout.render({
    area: 'admin',
    active: 'procurementSettings',
    title: t('procurementSettings'),
    breadcrumb: [{ label: t('home'), href: '/admin/dashboard.html' }, { label: t('procurementSettings') }]
  });
  if (!ctx) return;
  
  const sch = Object.assign({}, DataAPI.data().procurementSchedule);
  ctx.body.innerHTML = '<div class="pl-card" style="max-width:640px"><div class="pl-card-body"><div class="row g-3"><div class="col-md-6"><label class="form-label">'+escapeHtml(t('startTime'))+'</label><input type="number" class="form-control" id="sh" min="0" max="23" value="'+sch.startHour+'" /></div><div class="col-md-6"><label class="form-label">'+escapeHtml(t('endTime'))+'</label><input type="number" class="form-control" id="eh" min="0" max="23" value="'+sch.endHour+'" /></div></div>'+
    '<div class="mt-3"><label class="form-label">'+escapeHtml(t('workingDays'))+'</label><div class="d-flex flex-wrap gap-2" id="days"></div></div>'+
    '<button class="btn btn-pl-primary mt-3" id="save">'+escapeHtml(t('saveSchedule'))+'</button></div></div>';
  const dayNames = [t('sunday'),t('monday'),t('tuesday'),t('wednesday'),t('thursday'),t('friday'),t('saturday')];
  const box = document.getElementById('days');
  dayNames.forEach(function(n,i){ const lab=document.createElement('label'); lab.className='form-check form-check-inline'; lab.innerHTML='<input class="form-check-input day" type="checkbox" value="'+i+'" '+(sch.workingDays.indexOf(i)!==-1?'checked':'')+'> <span class="form-check-label">'+escapeHtml(n)+'</span>'; box.appendChild(lab); });
  document.getElementById('save').onclick=function(){
    DataAPI.save(function(d){ d.procurementSchedule.startHour=Number(document.getElementById('sh').value); d.procurementSchedule.endHour=Number(document.getElementById('eh').value); d.procurementSchedule.workingDays=Array.prototype.map.call(document.querySelectorAll('.day:checked'),function(c){return Number(c.value);}); d.procurementSchedule.label=String(d.procurementSchedule.startHour).padStart(2,'0')+':00 – '+String(d.procurementSchedule.endHour).padStart(2,'0')+':00'; return d; });
    UI.toast(t('scheduleSaved'));
  };

})();
